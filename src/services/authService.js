/**
 * Vaca Muerta Consulting - Authentication & RBAC Service
 * Manejo de sesiones y permisos jerárquicos: Admin (Dirección Técnica), Coordinador y Alumno.
 */

import { storageService } from './storageService.js';
import { getSupabase, remoteStore, isGoogleEnabled } from './supabaseClient.js';

function siteRoot() {
  return `${window.location.origin}${window.location.pathname}`;
}

/** Lee y limpia de la URL los parámetros que deja el regreso de Google o del mail */
function takeAuthParams() {
  const params = new URLSearchParams(window.location.search);
  const info = {
    fromRedirect: params.has('code') || params.has('error') || params.has('recovery'),
    recovery: params.get('recovery') === '1',
    error: params.get('error_description') || params.get('error') || ''
  };
  if (window.location.search) {
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.hash || '#/home'}`);
  }
  return info;
}

let pendingRecovery = false;
let pendingMessage = null;

const SESSION_KEY = 'current_session';
const listeners = new Set();

export const authService = {
  /**
   * Obtiene la sesión activa actual
   */
  getCurrentUser() {
    return storageService.get(SESSION_KEY);
  },

  /**
   * Determina si hay usuario autenticado
   */
  isAuthenticated() {
    return !!this.getCurrentUser();
  },

  /**
   * Verifica si el usuario actual posee un rol determinado
   */
  hasRole(role) {
    const user = this.getCurrentUser();
    return user ? user.role === role : false;
  },

  isAdmin() {
    return this.hasRole('admin');
  },

  isCoordinator() {
    return this.hasRole('coordinator');
  },

  isStudent() {
    return this.hasRole('student');
  },

  /**
   * Inicia sesión validando credenciales contra la colección de usuarios
   */
  login(username, password) {
    const cleanUser = String(username).trim().toLowerCase();
    const cleanPass = String(password).trim();

    const users = storageService.get('users') || [];
    const matched = users.find(u => u.role === 'student' && u.username && u.username.toLowerCase() === cleanUser && u.password === cleanPass);

    if (!matched) {
      return { success: false, message: 'Usuario o contraseña incorrectos. Verifique sus credenciales.' };
    }


    // Si es coordinador, enlazar datos de la provincia
    let extraData = {};
    if (matched.role === 'coordinator' && matched.coordinatorId) {
      const coordinators = storageService.get('coordinators') || [];
      const coord = coordinators.find(c => c.id === matched.coordinatorId);
      if (coord) {
        extraData = {
          zone: coord.province,
          promoCode: coord.promoCode,
          commissionRate: coord.commissionRate
        };
      }
    }

    const sessionPayload = {
      id: matched.id,
      username: matched.username,
      role: matched.role,
      name: matched.name,
      email: matched.email,
      phone: matched.phone || '',
      license: matched.license || '',
      title: matched.title || '',
      dni: matched.dni || '',
      cohorteId: matched.cohorteId || null,
      coordinatorId: matched.coordinatorId || null,
      ...extraData
    };

    storageService.set(SESSION_KEY, sessionPayload);
    this._notify();
    return { success: true, user: sessionPayload };
  },

  /**
   * Ingreso de Dirección Técnica con email y contraseña (Supabase Auth)
   */
  async loginWithEmail(email, password) {
    const supabase = await getSupabase();
    if (!supabase) {
      return { success: false, message: 'No hay conexión con el servidor. Probá de nuevo en unos minutos.' };
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email: String(email).trim(), password });
    if (error) {
      return { success: false, message: 'Email o contraseña incorrectos.' };
    }
    const isAdmin = await remoteStore.isAdmin();
    if (!isAdmin) {
      await supabase.auth.signOut();
      return { success: false, message: 'Esta cuenta no tiene permisos de administración.' };
    }
    const sessionPayload = this._adminPayload(data.user);
    storageService.set(SESSION_KEY, sessionPayload);
    storageService.setRemoteWritable(true);
    try { await storageService.syncFromRemote(); } catch (e) { console.error(e); }
    this._notify();
    return { success: true, user: sessionPayload };
  },

  /**
   * Al cargar la página: valida la sesión de administrador contra Supabase
   * y descarta sesiones de administrador que no estén respaldadas por la base.
   */
  async restoreSession() {
    const current = this.getCurrentUser();
    const supabase = await getSupabase();
    let supaUser = null;
    if (supabase) {
      const { data } = await supabase.auth.getSession();
      supaUser = data && data.session ? data.session.user : null;
    }
    const urlInfo = takeAuthParams();

    if (urlInfo.error) {
      pendingMessage = { text: `No se pudo completar el ingreso: ${urlInfo.error}`, type: 'error' };
    }

    if (supaUser && urlInfo.recovery) {
      pendingRecovery = true;
    }

    if (supaUser && await remoteStore.isAdmin()) {
      storageService.set(SESSION_KEY, this._adminPayload(supaUser));
      storageService.setRemoteWritable(true);
      if (urlInfo.fromRedirect && !urlInfo.recovery) {
        pendingMessage = { text: 'Ingresaste como Dirección Técnica.', type: 'success' };
        window.location.hash = '#/admin';
      }
      return;
    }

    if (supaUser && supabase) {
      pendingMessage = { text: `La cuenta ${supaUser.email} no tiene permisos de administración.`, type: 'error' };
      pendingRecovery = false;
      await supabase.auth.signOut();
    }

    storageService.setRemoteWritable(false);
    if (current && current.role !== 'student') {
      storageService.remove(SESSION_KEY);
    }
  },

  /** Mensaje pendiente tras volver de Google o del mail (se muestra una sola vez) */
  takePendingMessage() {
    const msg = pendingMessage;
    pendingMessage = null;
    return msg;
  },

  /** true si se volvió desde el enlace de recuperación y hay que pedir la contraseña nueva */
  takePendingRecovery() {
    const value = pendingRecovery;
    pendingRecovery = false;
    return value;
  },

  /** Ingreso con Google (Supabase OAuth) */
  async loginWithGoogle() {
    if (!(await isGoogleEnabled())) {
      return { success: false, message: 'El ingreso con Google todavía no está activado. Por ahora usá tu email y contraseña.' };
    }
    const supabase = await getSupabase();
    if (!supabase) {
      return { success: false, message: 'No hay conexión con el servidor. Probá de nuevo en unos minutos.' };
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: siteRoot() }
    });
    if (error) return { success: false, message: error.message };
    return { success: true, redirecting: true };
  },

  /** Envía el mail para crear una contraseña nueva */
  async sendPasswordReset(email) {
    const supabase = await getSupabase();
    if (!supabase) {
      return { success: false, message: 'No hay conexión con el servidor. Probá de nuevo en unos minutos.' };
    }
    const { error } = await supabase.auth.resetPasswordForEmail(String(email).trim(), {
      redirectTo: `${siteRoot()}?recovery=1`
    });
    if (error) {
      const tooMany = /rate|seconds|limit/i.test(error.message);
      return { success: false, message: tooMany ? 'Ya se envió un mail hace poco. Esperá unos minutos y probá de nuevo.' : error.message };
    }
    return { success: true };
  },

  /** Guarda la contraseña nueva (después de abrir el enlace del mail) */
  async updatePassword(newPassword) {
    const supabase = await getSupabase();
    if (!supabase) {
      return { success: false, message: 'No hay conexión con el servidor.' };
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      const weak = /password|weak|characters/i.test(error.message);
      return { success: false, message: weak ? 'La contraseña es muy débil: usá al menos 8 caracteres combinando letras y números.' : error.message };
    }
    return { success: true };
  },

  _adminPayload(supaUser) {
    return {
      id: supaUser.id,
      username: supaUser.email,
      role: 'admin',
      name: 'Lic. Víctor Javier Paredes',
      email: supaUser.email,
      license: 'Mat. Profesional PA 446',
      title: 'Director Técnico'
    };
  },

  /**
   * Cierra la sesión activa
   */
  logout() {
    const wasAdmin = this.isAdmin();
    storageService.remove(SESSION_KEY);
    storageService.setRemoteWritable(false);
    if (wasAdmin) getSupabase().then(sb => sb && sb.auth.signOut()).catch(() => {});
    this._notify();
    return true;
  },

  /**
   * Permite suscribirse a cambios de autenticación
   */
  subscribe(callback) {
    listeners.add(callback);
    return () => listeners.delete(callback);
  },

  _notify() {
    const user = this.getCurrentUser();
    listeners.forEach(cb => {
      try { cb(user); } catch (e) { console.error(e); }
    });
  }
};

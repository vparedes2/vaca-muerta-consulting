/**
 * Vaca Muerta Consulting - Authentication & RBAC Service
 * Manejo de sesiones y permisos jerárquicos: Admin (Dirección Técnica), Coordinador y Alumno.
 */

import { storageService } from './storageService.js';
import { getSupabase, remoteStore } from './supabaseClient.js';

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

    if (supaUser && await remoteStore.isAdmin()) {
      storageService.set(SESSION_KEY, this._adminPayload(supaUser));
      storageService.setRemoteWritable(true);
      return;
    }
    storageService.setRemoteWritable(false);
    if (current && current.role !== 'student') {
      storageService.remove(SESSION_KEY);
    }
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

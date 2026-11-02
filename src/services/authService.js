/**
 * Vaca Muerta Consulting - Authentication & RBAC Service
 * Manejo de sesiones y permisos jerárquicos: Admin (Dirección Técnica), Coordinador y Alumno.
 */

import { storageService } from './storageService.js';

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
    const matched = users.find(u => u.username.toLowerCase() === cleanUser && u.password === cleanPass);

    if (!matched) {
      // También permitir búsqueda si coincide con coordinadores
      const coordinators = storageService.get('coordinators') || [];
      const coordMatch = coordinators.find(c => c.username.toLowerCase() === cleanUser && c.password === cleanPass);
      
      if (coordMatch) {
        const sessionPayload = {
          id: coordMatch.id,
          username: coordMatch.username,
          role: 'coordinator',
          coordinatorId: coordMatch.id,
          name: coordMatch.name,
          email: coordMatch.email,
          zone: coordMatch.province,
          promoCode: coordMatch.promoCode
        };
        storageService.set(SESSION_KEY, sessionPayload);
        this._notify();
        return { success: true, user: sessionPayload };
      }

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
   * Cierra la sesión activa
   */
  logout() {
    storageService.remove(SESSION_KEY);
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

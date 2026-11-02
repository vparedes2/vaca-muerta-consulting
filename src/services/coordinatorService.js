/**
 * Vaca Muerta Consulting - Coordinator Service
 * Red comercial de promotores provinciales:
 * - Control de inscriptos en su zona (Cuyo, Córdoba, Buenos Aires, etc.)
 * - Cálculo automático de comisión del 30% sobre la facturación real
 * - Seguimiento de metas comerciales hacia febrero
 */

import { storageService } from './storageService.js';

export const coordinatorService = {
  DEFAULT_COMMISSION_RATE: 0.30,

  /**
   * Obtiene todos los coordinadores provinciales registrados
   */
  getAll() {
    return storageService.get('coordinators') || [];
  },

  /**
   * Obtiene un coordinador por su identificador o nombre de usuario
   */
  getById(idOrUsername) {
    const coords = this.getAll();
    return coords.find(c => c.id === idOrUsername || c.username === idOrUsername) || null;
  },

  /**
   * Registra un nuevo coordinador provincial (Exclusivo Admin)
   */
  create(data) {
    const coords = storageService.get('coordinators') || [];
    const newId = `coord-${Date.now()}`;
    const cleanUsername = (data.username || `coord.${data.province.toLowerCase().slice(0, 4)}`).trim();

    const newCoord = {
      id: newId,
      username: cleanUsername,
      password: data.password || 'comercial2026',
      name: data.name,
      province: data.province,
      email: data.email,
      phone: data.phone || '',
      promoCode: data.promoCode || `${data.province.toUpperCase().slice(0, 3)}30`,
      commissionRate: Number(data.commissionRate) || this.DEFAULT_COMMISSION_RATE,
      targetGoal: Number(data.targetGoal) || 50,
      activeReferralsCount: 0,
      totalSalesRevenue: 0,
      commissionEarned: 0,
      commissionPaid: 0,
      commissionPending: 0,
      notes: data.notes || ''
    };

    coords.push(newCoord);
    storageService.set('coordinators', coords);

    // Mapear también en tabla de usuarios para permitir login con RBAC
    const users = storageService.get('users') || [];
    users.push({
      id: `user-${newId}`,
      username: cleanUsername,
      password: newCoord.password,
      role: 'coordinator',
      coordinatorId: newId,
      name: newCoord.name,
      email: newCoord.email,
      zone: newCoord.province
    });
    storageService.set('users', users);

    return newCoord;
  },

  /**
   * Obtiene estadísticas y balance financiero de un coordinador
   */
  getStats(coordinatorId) {
    const coord = this.getById(coordinatorId);
    if (!coord) return null;

    const targetProgress = Math.min(100, Math.round((coord.activeReferralsCount / coord.targetGoal) * 100));
    const pendingCommission = Math.max(0, coord.commissionEarned - coord.commissionPaid);

    return {
      coordinator: coord,
      targetGoal: coord.targetGoal,
      activeReferralsCount: coord.activeReferralsCount,
      targetProgress,
      missingForGoal: Math.max(0, coord.targetGoal - coord.activeReferralsCount),
      totalSalesRevenue: coord.totalSalesRevenue,
      commissionEarned: coord.commissionEarned,
      commissionPaid: coord.commissionPaid,
      commissionPending: pendingCommission,
      commissionPercentDisplay: `${Math.round(coord.commissionRate * 100)}%`
    };
  },

  /**
   * Registra una liquidación de comisiones
   */
  liquidateCommission(coordinatorId, amount) {
    const coords = storageService.get('coordinators') || [];
    const index = coords.findIndex(c => c.id === coordinatorId);
    if (index === -1) throw new Error('Coordinador no encontrado.');

    const coord = coords[index];
    const numAmount = Number(amount);
    coord.commissionPaid = (coord.commissionPaid || 0) + numAmount;
    coord.commissionPending = Math.max(0, coord.commissionEarned - coord.commissionPaid);

    coords[index] = coord;
    storageService.set('coordinators', coords);
    return coord;
  },

  /**
   * Elimina un coordinador / colaborador provincial y remueve su usuario de acceso
   */
  delete(coordinatorId) {
    const coords = storageService.get('coordinators') || [];
    const coordToDelete = coords.find(c => c.id === coordinatorId);
    if (!coordToDelete) return false;

    // 1. Quitar de lista de coordinadores
    const updatedCoords = coords.filter(c => c.id !== coordinatorId);
    storageService.set('coordinators', updatedCoords);

    // 2. Eliminar usuario asociado de la tabla de accesos
    const users = storageService.get('users') || [];
    const updatedUsers = users.filter(u => u.coordinatorId !== coordinatorId && u.username !== coordToDelete.username);
    storageService.set('users', updatedUsers);

    return true;
  }
};

/**
 * Vaca Muerta Consulting - Referral Program Service
 * Lógica matemática del Plan de Referidos:
 * - 20% de descuento por cada colega inscripto.
 * - Con 5 referidos = 100% bonificado y reintegro total post-capacitación.
 */

import { storageService } from './storageService.js';

export const referralService = {
  DISCOUNT_PER_PERSON: 0.20,
  TARGET_FOR_FULL_BONIFICATION: 5,

  /**
   * Obtiene la red de referidos de un alumno
   */
  getReferralsForStudent(studentId) {
    const users = storageService.get('users') || [];
    const student = users.find(u => u.id === studentId || u.username === studentId);
    if (!student) return [];
    return student.referrals || [];
  },

  /**
   * Calcula el estado financiero y porcentaje de descuento del alumno
   */
  getDiscountSummary(studentId, basePrice = 0) {
    const referrals = this.getReferralsForStudent(studentId);
    const count = referrals.length;
    const rawDiscount = count * this.DISCOUNT_PER_PERSON;
    const discountPercent = Math.min(1.0, rawDiscount); // Máximo 100%
    const isFullyBonified = count >= this.TARGET_FOR_FULL_BONIFICATION;
    const discountAmount = Math.round(basePrice * discountPercent);
    const finalPrice = Math.max(0, basePrice - discountAmount);

    return {
      referralsCount: count,
      discountPercent: Math.round(discountPercent * 100), // Ej: 40%
      discountFactor: discountPercent,
      isFullyBonified,
      requiresRefund: isFullyBonified,
      targetProgress: Math.min(100, Math.round((count / this.TARGET_FOR_FULL_BONIFICATION) * 100)),
      missingForFull: Math.max(0, this.TARGET_FOR_FULL_BONIFICATION - count),
      discountAmount,
      finalPrice
    };
  },

  /**
   * Agrega un nuevo colega referido a la red del alumno (prueba dinámica)
   */
  addReferral(studentId, colleagueData) {
    const users = storageService.get('users') || [];
    const userIndex = users.findIndex(u => u.id === studentId || u.username === studentId);
    if (userIndex === -1) throw new Error('Estudiante no encontrado');

    const student = users[userIndex];
    if (!student.referrals) student.referrals = [];

    const newReferral = {
      id: `ref-${Date.now()}`,
      name: colleagueData.name || 'Colega de Operaciones',
      dni: colleagueData.dni || '38.000.000',
      email: colleagueData.email || 'colega@petrolera.com.ar',
      courseTitle: colleagueData.courseTitle || 'Water Transfer Nivel 1 y 2',
      status: 'Inscripto y Pagado',
      paidAmount: Number(colleagueData.paidAmount) || 320000,
      registeredAt: new Date().toISOString().split('T')[0],
      discountGenerated: this.DISCOUNT_PER_PERSON
    };

    student.referrals.push(newReferral);
    users[userIndex] = student;
    storageService.set('users', users);

    return {
      referral: newReferral,
      newSummary: this.getDiscountSummary(student.id, colleagueData.courseBasePrice || 320000)
    };
  },

  /**
   * Auditoría global de la red de referidos para la Dirección Técnica
   */
  getGlobalReferralAudit() {
    const users = storageService.get('users') || [];
    const students = users.filter(u => u.role === 'student');

    let totalReferralsCount = 0;
    let studentsWithBonification = 0;
    let totalDiscountDisbursed = 0;

    const auditList = students.map(st => {
      const referrals = st.referrals || [];
      const count = referrals.length;
      totalReferralsCount += count;
      const discount = Math.min(1.0, count * this.DISCOUNT_PER_PERSON);
      if (count >= this.TARGET_FOR_FULL_BONIFICATION) {
        studentsWithBonification++;
      }
      return {
        studentId: st.id,
        name: st.name,
        dni: st.dni,
        email: st.email,
        phone: st.phone,
        cohorteId: st.cohorteId,
        referralsCount: count,
        discountPercent: Math.round(discount * 100),
        is100PercentBonified: count >= this.TARGET_FOR_FULL_BONIFICATION,
        referralsList: referrals
      };
    });

    const averageReferrals = students.length > 0 ? (totalReferralsCount / students.length).toFixed(1) : 0;

    return {
      totalStudents: students.length,
      totalReferralsCount,
      averageReferrals,
      studentsWithBonification,
      auditList
    };
  }
};

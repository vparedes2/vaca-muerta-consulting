/**
 * Vaca Muerta Consulting - Referral Program Service
 * Política de Reintegros y Bonificaciones Post-Capacitación:
 * - El arancel oficial se abona al 100% al inscribirse.
 * - Los reintegros se liquidan una vez concluida la capacitación.
 * - Escala:
 *   * 20% de reintegro por cada colega referido.
 *   * Con 5 referidos = 100% bonificado (se devuelve el 100% de lo abonado por su curso).
 *   * Con más de 5 referidos = Reintegro del 100% de su curso MÁS 20% adicional de ganancia neta
 *     en dinero en efectivo/transferencia por cada referido que supere los 5.
 */

import { storageService } from './storageService.js';

export const referralService = {
  DISCOUNT_PER_PERSON: 0.20,
  TARGET_FOR_FULL_REFUND: 5,

  /**
   * Obtiene la lista de colegas referidos inscriptos por el alumno hasta el momento
   */
  getReferralsForStudent(studentId) {
    const users = storageService.get('users') || [];
    const student = users.find(u => u.id === studentId || u.username === studentId);
    if (!student) return [];
    return student.referrals || [];
  },

  /**
   * Calcula el estado financiero de reintegros y premios post-capacitación
   * @param {string} studentId - ID o username del alumno
   * @param {number} basePrice - Arancel oficial del curso del alumno (ej: 400.000)
   */
  getDiscountSummary(studentId, basePrice = 400000) {
    const referrals = this.getReferralsForStudent(studentId);
    const count = referrals.length;

    // 1. Reintegro sobre el valor del curso propio (máximo 100% a los 5 colegas)
    const refundFactor = Math.min(1.0, count * this.DISCOUNT_PER_PERSON);
    const refundPercent = Math.round(refundFactor * 100);
    const courseRefundAmount = Math.round(basePrice * refundFactor);

    // 2. Bonificación completa alcanzada (5 o más)
    const isFullyBonified = count >= this.TARGET_FOR_FULL_REFUND;

    // 3. Referidos por sobre los 5 (+20% por cada uno extra)
    const extraReferralsCount = Math.max(0, count - this.TARGET_FOR_FULL_REFUND);
    const extraBonusPerReferral = Math.round(basePrice * this.DISCOUNT_PER_PERSON);
    const extraBonusTotal = extraReferralsCount * extraBonusPerReferral;

    // 4. Liquidación total a cobrar post-capacitación
    const totalPayout = courseRefundAmount + extraBonusTotal;
    const netProfit = Math.max(0, totalPayout - basePrice);

    return {
      referralsCount: count,
      basePrice,
      refundPercent, // ej: 40% (con 2), 100% (con 5+)
      courseRefundAmount, // ej: $160.000 (con 2), $400.000 (con 5+)
      isFullyBonified,
      targetProgress: Math.min(100, Math.round((count / this.TARGET_FOR_FULL_REFUND) * 100)),
      missingForFull: Math.max(0, this.TARGET_FOR_FULL_REFUND - count),
      extraReferralsCount,
      extraBonusTotal,
      totalPayout, // Total que cobrará por transferencia al concluir
      netProfit, // Ganancia neta por encima del valor del curso
      hasExtraBonus: extraReferralsCount > 0,
      payoutStatus: count > 0 ? 'Pendiente de acreditación al concluir el cursado' : 'Sin referidos aún'
    };
  },

  /**
   * Registra un nuevo colega referido inscripto en el sistema
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
      status: 'Inscripto y Confirmado',
      paidAmount: Number(colleagueData.paidAmount) || 400000,
      registeredAt: new Date().toISOString().split('T')[0],
      refundGeneratedPercent: 20
    };

    student.referrals.push(newReferral);
    users[userIndex] = student;
    storageService.set('users', users);

    return {
      referral: newReferral,
      newSummary: this.getDiscountSummary(student.id, colleagueData.courseBasePrice || 400000)
    };
  },

  /**
   * Auditoría global de la red de referidos para Dirección Técnica / Tesorería
   */
  getGlobalReferralAudit() {
    const users = storageService.get('users') || [];
    const students = users.filter(u => u.role === 'student');

    let totalReferralsCount = 0;
    let studentsWithFullRefund = 0;
    let studentsWithExtraBonus = 0;
    let totalCommittedPayouts = 0;

    const auditList = students.map(st => {
      const referrals = st.referrals || [];
      const count = referrals.length;
      totalReferralsCount += count;

      const summary = this.getDiscountSummary(st.id, 400000);
      if (summary.isFullyBonified) studentsWithFullRefund++;
      if (summary.hasExtraBonus) studentsWithExtraBonus++;
      totalCommittedPayouts += summary.totalPayout;

      return {
        studentId: st.id,
        name: st.name,
        dni: st.dni,
        email: st.email,
        phone: st.phone,
        cohorteId: st.cohorteId,
        referralsCount: count,
        courseRefundAmount: summary.courseRefundAmount,
        extraBonusTotal: summary.extraBonusTotal,
        totalPayout: summary.totalPayout,
        isFullyBonified: summary.isFullyBonified,
        hasExtraBonus: summary.hasExtraBonus,
        referralsList: referrals
      };
    });

    const averageReferrals = students.length > 0 ? (totalReferralsCount / students.length).toFixed(1) : 0;

    return {
      totalStudents: students.length,
      totalReferralsCount,
      averageReferrals,
      studentsWithFullRefund,
      studentsWithExtraBonus,
      totalCommittedPayouts,
      auditList
    };
  }
};

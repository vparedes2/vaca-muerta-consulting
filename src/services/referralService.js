/**
 * Vaca Muerta Consulting - Referral Program & Graduate Commission Service
 * 
 * Reglas de Negocio Oficiales:
 * 1. FASE 1: DURANTE EL CURSADO (Alumno Activo)
 *    - El arancel oficial se abona al 100% al inscribirse (sin descuento al pagar).
 *    - Los reintegros se liquidan por transferencia concluida la capacitación:
 *      * 20% de reintegro por cada colega referido.
 *      * Con 5 referidos = 100% del curso bonificado (reintegro total de lo pagado).
 *      * Con más de 5 (>5) = 100% de devolución + 20% adicional de ganancia neta en dinero
 *        por cada referido por sobre el valor de su curso.
 * 
 * 2. FASE 2: LUEGO DE EGRESADO (Embajador Graduado)
 *    - Comisión permanente del 15% en efectivo por cada nuevo colega inscripto con su código.
 *    - CONDICIÓN EXCLUYENTE: El colega debe abonar efectivamente su arancel para considerarse
 *      referido válido computable (los referidos con pago pendiente no devengan comisión hasta pagar).
 */

import { storageService } from './storageService.js';

export const referralService = {
  STUDENT_REFUND_PER_PERSON: 0.20, // 20% durante cursado
  TARGET_FOR_FULL_REFUND: 5,        // 5 colegas = 100%
  GRADUATE_COMMISSION_RATE: 0.15,   // 15% luego de egresado (sobre referidos válidos pagados)

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
   * Obtiene el perfil completo y estado académico del alumno
   */
  getStudentProfile(studentId) {
    const users = storageService.get('users') || [];
    return users.find(u => u.id === studentId || u.username === studentId) || null;
  },

  /**
   * Cambia el estado del estudiante entre 'cursando' y 'egresado'
   */
  setStudentStatus(studentId, newStatus) {
    const users = storageService.get('users') || [];
    const index = users.findIndex(u => u.id === studentId || u.username === studentId);
    if (index === -1) return null;

    users[index].academicStatus = newStatus; // 'cursando' | 'egresado'
    if (newStatus === 'egresado') {
      users[index].graduatedAt = users[index].graduatedAt || new Date().toISOString().split('T')[0];
    }
    storageService.set('users', users);
    return users[index];
  },

  /**
   * Calcula el estado financiero de reintegros o comisiones según si está cursando o ya es egresado
   * @param {string} studentId - ID o username del alumno
   * @param {number} basePrice - Arancel oficial del curso del alumno (ej: 400.000)
   */
  getDiscountSummary(studentId, basePrice = 400000) {
    const profile = this.getStudentProfile(studentId);
    const isGraduate = profile && profile.academicStatus === 'egresado';
    const referrals = this.getReferralsForStudent(studentId);

    // Separar referidos válidos (pagados) de pendientes
    const paidReferrals = referrals.filter(r => r.paymentStatus === 'paid' || r.isPaid !== false);
    const pendingReferrals = referrals.filter(r => r.paymentStatus === 'pending' || r.isPaid === false);

    // --- CASO 1: LUEGO DE EGRESADO (15% Comisión por referido válido abonado) ---
    if (isGraduate) {
      let graduateCommissionEarned = 0;
      paidReferrals.forEach(r => {
        const refAmount = Number(r.paidAmount) || basePrice;
        graduateCommissionEarned += Math.round(refAmount * this.GRADUATE_COMMISSION_RATE);
      });

      return {
        isGraduate: true,
        academicStatus: 'egresado',
        referralsCount: referrals.length,
        paidReferralsCount: paidReferrals.length,
        pendingReferralsCount: pendingReferrals.length,
        graduateCommissionRate: this.GRADUATE_COMMISSION_RATE,
        graduateCommissionPercent: 15,
        graduateCommissionEarned,
        totalPayout: graduateCommissionEarned,
        basePrice,
        payoutStatus: paidReferrals.length > 0
          ? `Habilitado para cobro bancario (${paidReferrals.length} referidos abonados)`
          : 'Aguardando primer referido con pago confirmado'
      };
    }

    // --- CASO 2: DURANTE EL CURSADO (Reintegro post-cursado: 20% c/u, 100% con 5, +20% extra >5) ---
    const count = paidReferrals.length; // Referidos válidos abonados
    const refundFactor = Math.min(1.0, count * this.STUDENT_REFUND_PER_PERSON);
    const refundPercent = Math.round(refundFactor * 100);
    const courseRefundAmount = Math.round(basePrice * refundFactor);

    const isFullyBonified = count >= this.TARGET_FOR_FULL_REFUND;
    const extraReferralsCount = Math.max(0, count - this.TARGET_FOR_FULL_REFUND);
    const extraBonusPerReferral = Math.round(basePrice * this.STUDENT_REFUND_PER_PERSON);
    const extraBonusTotal = extraReferralsCount * extraBonusPerReferral;

    const totalPayout = courseRefundAmount + extraBonusTotal;
    const netProfit = Math.max(0, totalPayout - basePrice);

    return {
      isGraduate: false,
      academicStatus: 'cursando',
      referralsCount: referrals.length,
      paidReferralsCount: paidReferrals.length,
      pendingReferralsCount: pendingReferrals.length,
      basePrice,
      refundPercent,
      courseRefundAmount,
      isFullyBonified,
      targetProgress: Math.min(100, Math.round((count / this.TARGET_FOR_FULL_REFUND) * 100)),
      missingForFull: Math.max(0, this.TARGET_FOR_FULL_REFUND - count),
      extraReferralsCount,
      extraBonusTotal,
      totalPayout,
      netProfit,
      hasExtraBonus: extraReferralsCount > 0,
      payoutStatus: count > 0 ? 'Liquidación por transferencia bancaria al concluir la capacitación' : 'Sin referidos activos aún'
    };
  },

  /**
   * Registra un nuevo colega referido inscripto en el sistema
   */
  addReferral(studentId, colleagueData = {}) {
    const users = storageService.get('users') || [];
    const userIndex = users.findIndex(u => u.id === studentId || u.username === studentId);
    if (userIndex === -1) throw new Error('Estudiante no encontrado');

    const student = users[userIndex];
    if (!student.referrals) student.referrals = [];

    const isPaid = colleagueData.isPaid !== false && colleagueData.paymentStatus !== 'pending';
    const courseAmount = Number(colleagueData.paidAmount || colleagueData.courseBasePrice) || 400000;

    const newReferral = {
      id: `ref-${Date.now()}`,
      name: colleagueData.name || 'Colega de Operaciones',
      dni: colleagueData.dni || `${Math.floor(35000000 + Math.random() * 8000000)}`,
      email: colleagueData.email || 'colega@operaciones.com.ar',
      courseTitle: colleagueData.courseTitle || 'Water Transfer Nivel 1 y 2',
      paidAmount: courseAmount,
      paymentStatus: isPaid ? 'paid' : 'pending',
      isPaid: isPaid,
      registeredAt: new Date().toISOString().split('T')[0],
      refundOrCommission: student.academicStatus === 'egresado' ? 'Comisión 15%' : 'Reintegro 20%'
    };

    student.referrals.push(newReferral);
    users[userIndex] = student;
    storageService.set('users', users);

    return {
      referral: newReferral,
      newSummary: this.getDiscountSummary(student.id, courseAmount)
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
    let totalGraduateCommissions = 0;
    let totalCommittedPayouts = 0;

    const auditList = students.map(st => {
      const summary = this.getDiscountSummary(st.id, 400000);
      const referrals = st.referrals || [];
      totalReferralsCount += referrals.length;

      if (!summary.isGraduate) {
        if (summary.isFullyBonified) studentsWithFullRefund++;
        if (summary.hasExtraBonus) studentsWithExtraBonus++;
      } else {
        totalGraduateCommissions += summary.graduateCommissionEarned;
      }

      totalCommittedPayouts += summary.totalPayout;

      return {
        studentId: st.id,
        name: st.name,
        dni: st.dni,
        email: st.email,
        phone: st.phone,
        cohorteId: st.cohorteId,
        isGraduate: summary.isGraduate,
        academicStatus: summary.academicStatus,
        referralsCount: referrals.length,
        paidReferralsCount: summary.paidReferralsCount,
        pendingReferralsCount: summary.pendingReferralsCount,
        courseRefundAmount: summary.courseRefundAmount || 0,
        extraBonusTotal: summary.extraBonusTotal || 0,
        graduateCommissionEarned: summary.graduateCommissionEarned || 0,
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
      totalGraduateCommissions,
      totalCommittedPayouts,
      auditList
    };
  }
};

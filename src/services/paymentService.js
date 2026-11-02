/**
 * Vaca Muerta Consulting - Payment Service
 * Pasarela de pagos integrada con Mercado Pago:
 * - El arancel oficial del curso se abona al 100% al momento de la inscripción.
 * - Los reintegros acumulados por referidos (20% por colega, 100% con 5, y +20% por colega extra)
 *   se devuelven al alumno una vez concluida la capacitación.
 */

import { storageService } from './storageService.js';
import { referralService } from './referralService.js';

export const paymentService = {
  /**
   * Calcula el arancel oficial a cobrar y el reintegro proyectado post-capacitación
   */
  calculateCheckoutAmount(studentId, course) {
    const basePrice = course.basePrice || 320000;
    const summary = referralService.getDiscountSummary(studentId, basePrice);

    return {
      courseId: course.id,
      courseTitle: course.title,
      basePrice, // Se abona el 100%
      finalAmount: basePrice, // Monto a pagar en pasarela = 100% arancel oficial
      refundPercent: summary.refundPercent,
      courseRefundAmount: summary.courseRefundAmount,
      extraBonusTotal: summary.extraBonusTotal,
      totalRefundPayout: summary.totalPayout, // Lo que se le devuelve al concluir
      isFullyBonified: summary.isFullyBonified,
      hasExtraBonus: summary.hasExtraBonus,
      referralsCount: summary.referralsCount,
      refundPolicyNote: 'El arancel se abona completo. Todos los reintegros acumulados se devuelven por transferencia bancaria una vez finalizado el cursado.'
    };
  },

  /**
   * Genera el payload de preferencia de Mercado Pago (Checkout Pro)
   */
  generatePreference(student, course, checkoutDetails) {
    const settings = storageService.get('settings') || {};

    return {
      preferenceId: `PREF-${Date.now()}-${course.id.toUpperCase()}`,
      items: [
        {
          id: course.id,
          title: course.title,
          description: `Matrícula Oficial 100% - Vaca Muerta Consulting (Lic. Víctor Paredes PA 446)`,
          unit_price: checkoutDetails.basePrice,
          quantity: 1,
          currency_id: 'ARS'
        }
      ],
      payer: {
        name: student.name,
        email: student.email,
        identification: { type: 'DNI', number: student.dni || '34892115' }
      },
      metadata: {
        studentId: student.id,
        courseId: course.id,
        referralsCount: checkoutDetails.referralsCount,
        refundProjected: checkoutDetails.totalRefundPayout
      },
      back_urls: {
        success: `${window.location.origin}/#/campus?status=success`,
        failure: `${window.location.origin}/#/campus?status=failure`,
        pending: `${window.location.origin}/#/campus?status=pending`
      },
      auto_return: 'approved'
    };
  },

  /**
   * Registra una transacción aprobada en el sistema
   */
  recordPayment(studentId, courseId, amount, paymentMethod = 'Mercado Pago') {
    const payments = storageService.get('payments') || [];
    const record = {
      id: `PAY-${Date.now()}`,
      studentId,
      courseId,
      amount,
      paymentMethod,
      status: 'Aprobado',
      paidAt: new Date().toISOString()
    };
    payments.push(record);
    storageService.set('payments', payments);
    return record;
  }
};

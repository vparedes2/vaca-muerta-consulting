/**
 * Vaca Muerta Consulting - Payment Service
 * Pasarela de pagos integrada con Mercado Pago:
 * - Recálculo dinámico de aranceles según descuentos de referidos (20% por colega)
 * - Bonificación total (100%) y aviso de reintegro
 * - Generación de checkout links y modal de confirmación
 */

import { storageService } from './storageService.js';
import { referralService } from './referralService.js';

export const paymentService = {
  /**
   * Calcula el arancel exacto a cobrar aplicando el descuento acumulado del alumno
   */
  calculateCheckoutAmount(studentId, course) {
    const basePrice = course.basePrice || 320000;
    const summary = referralService.getDiscountSummary(studentId, basePrice);

    return {
      courseId: course.id,
      courseTitle: course.title,
      basePrice,
      discountPercent: summary.discountPercent,
      discountAmount: summary.discountAmount,
      finalAmount: summary.finalPrice,
      isFullyBonified: summary.isFullyBonified,
      requiresRefund: summary.requiresRefund,
      referralsCount: summary.referralsCount
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
          description: `Inscripción oficial - Vaca Muerta Consulting (Lic. Víctor Paredes PA 446)`,
          unit_price: checkoutDetails.finalAmount,
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
        discountApplied: `${checkoutDetails.discountPercent}%`,
        isFullyBonified: checkoutDetails.isFullyBonified
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

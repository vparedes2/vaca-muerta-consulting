/**
 * Vaca Muerta Consulting - Cohort Service
 * Gestión de grupos escalonados (Febrero A/B, Marzo, etc.) para distribuir 190+ alumnos
 * y evitar la saturación de tutorías pedagógicas en yacimiento.
 */

import { storageService } from './storageService.js';

export const cohortService = {
  /**
   * Obtiene todas las cohortes con el conteo dinámico de estudiantes inscriptos
   */
  getAll() {
    const cohorts = storageService.get('cohorts') || [];
    const users = storageService.get('users') || [];
    const students = users.filter(u => u.role === 'student');

    // Recalcular cupos ocupados en tiempo real
    return cohorts.map(cohort => {
      const enrolledCount = students.filter(s => s.cohorteId === cohort.id).length;
      return {
        ...cohort,
        enrolled: Math.max(cohort.enrolled, enrolledCount), // conserva al menos el histórico base
        occupancyRate: Math.round((Math.max(cohort.enrolled, enrolledCount) / cohort.capacity) * 100)
      };
    });
  },

  /**
   * Obtiene una cohorte por su ID
   */
  getById(cohortId) {
    const cohorts = this.getAll();
    return cohorts.find(c => c.id === cohortId) || null;
  },

  /**
   * Crea una nueva cohorte escalonada
   */
  create(cohortData) {
    const cohorts = storageService.get('cohorts') || [];
    const newId = cohortData.id || `cohorte-${Date.now()}`;

    const newCohort = {
      id: newId,
      name: cohortData.name,
      courseId: cohortData.courseId,
      courseTitle: cohortData.courseTitle || 'Curso Especial',
      startDate: cohortData.startDate,
      endDate: cohortData.endDate,
      capacity: Number(cohortData.capacity) || 30,
      enrolled: 0,
      tutor: cohortData.tutor || 'Lic. Víctor Javier Paredes',
      schedule: cohortData.schedule || 'Lunes y Miércoles 19:00 hs',
      status: 'Inscripciones Abiertas',
      roomLink: cohortData.roomLink || 'https://meet.google.com/vmc-sala',
      notes: cohortData.notes || ''
    };

    cohorts.push(newCohort);
    storageService.set('cohorts', cohorts);
    return newCohort;
  },

  /**
   * Actualiza los datos de una cohorte existente
   */
  update(cohortId, updatedFields) {
    const cohorts = storageService.get('cohorts') || [];
    const index = cohorts.findIndex(c => c.id === cohortId);
    if (index === -1) throw new Error('Cohorte no encontrada.');

    cohorts[index] = { ...cohorts[index], ...updatedFields };
    storageService.set('cohorts', cohorts);
    return cohorts[index];
  },

  /**
   * Asigna o traslada a un estudiante a una cohorte específica
   */
  assignStudent(studentId, cohortId) {
    const users = storageService.get('users') || [];
    const studentIndex = users.findIndex(u => u.id === studentId);
    if (studentIndex === -1) throw new Error('Estudiante no encontrado.');

    users[studentIndex].cohorteId = cohortId;
    storageService.set('users', users);
    return users[studentIndex];
  }
};

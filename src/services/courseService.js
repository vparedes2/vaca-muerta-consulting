/**
 * Vaca Muerta Consulting - Course Service
 * Gestión del catálogo de cursos, módulos, lecciones y seguimiento de progreso pedagógico.
 */

import { storageService } from './storageService.js';

export const courseService = {
  /**
   * Obtiene todos los cursos activos del catálogo
   */
  getAll() {
    return storageService.get('courses') || [];
  },

  /**
   * Obtiene un curso por su identificador único
   */
  getById(courseId) {
    const courses = this.getAll();
    return courses.find(c => c.id === courseId) || null;
  },

  /**
   * Actualiza el valor arancelario oficial de un curso (Exclusivo Admin)
   */
  updatePrice(courseId, newPrice) {
    const numPrice = Number(newPrice);
    if (isNaN(numPrice) || numPrice < 0) {
      throw new Error('El precio arancelario debe ser un número positivo.');
    }

    const courses = this.getAll();
    const index = courses.findIndex(c => c.id === courseId);
    if (index === -1) {
      throw new Error('Curso no encontrado.');
    }

    courses[index].basePrice = numPrice;
    storageService.set('courses', courses);
    return courses[index];
  },

  /**
   * Obtiene el progreso de un alumno en un curso específico
   */
  getUserProgress(userId, courseId) {
    const users = storageService.get('users') || [];
    const user = users.find(u => u.id === userId);
    if (!user || !user.progress || !user.progress[courseId]) {
      return { completedLessons: [], percent: 0, lastAccess: null };
    }
    return user.progress[courseId];
  },

  /**
   * Alterna el estado de una lección (completada / pendiente) y recalcula el % global
   */
  toggleLesson(userId, courseId, lessonId) {
    const users = storageService.get('users') || [];
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) return null;

    const user = users[userIndex];
    if (!user.progress) user.progress = {};
    if (!user.progress[courseId]) {
      user.progress[courseId] = { completedLessons: [], percent: 0, lastAccess: new Date().toISOString() };
    }

    const completed = new Set(user.progress[courseId].completedLessons || []);
    if (completed.has(lessonId)) {
      completed.delete(lessonId);
    } else {
      completed.add(lessonId);
    }

    const course = this.getById(courseId);
    let totalLessonsCount = 0;
    if (course && course.modules) {
      course.modules.forEach(m => {
        totalLessonsCount += (m.lessons ? m.lessons.length : 0);
      });
    }

    const completedList = Array.from(completed);
    const percent = totalLessonsCount > 0 ? Math.round((completedList.length / totalLessonsCount) * 100) : 0;

    user.progress[courseId] = {
      completedLessons: completedList,
      percent: Math.min(100, percent),
      lastAccess: new Date().toISOString()
    };

    users[userIndex] = user;
    storageService.set('users', users);

    return user.progress[courseId];
  },

  /**
   * Inscribe a un estudiante en un curso
   */
  enrollStudent(userId, courseId, cohorteId = null) {
    const users = storageService.get('users') || [];
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) throw new Error('Usuario no encontrado');

    const user = users[userIndex];
    if (!user.enrolledCourses) user.enrolledCourses = [];
    if (!user.enrolledCourses.includes(courseId)) {
      user.enrolledCourses.push(courseId);
    }
    if (cohorteId) {
      user.cohorteId = cohorteId;
    }

    users[userIndex] = user;
    storageService.set('users', users);
    return user;
  }
};

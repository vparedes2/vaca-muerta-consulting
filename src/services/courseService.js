/**
 * Vaca Muerta Consulting - Course Service
 * Módulo ABM integral del catálogo de cursos, módulos, lecciones y seguimiento pedagógico:
 * - Alta, baja y modificación completa de capacitaciones (Exclusivo Dirección Técnica)
 * - Pausar / Reactivar inscripciones
 * - Ocultar / Publicar cursos del catálogo
 * - Actualización dinámica de aranceles oficiales
 */

import { storageService } from './storageService.js';

export const courseService = {
  /**
   * Obtiene todos los cursos del sistema (para panel Admin)
   */
  getAll() {
    return storageService.get('courses') || [];
  },

  /**
   * Obtiene solo los cursos visibles para el catálogo público y alumnos
   */
  getPublicCourses() {
    const courses = this.getAll();
    return courses.filter(c => c.status !== 'hidden');
  },

  /**
   * Obtiene un curso por su ID único
   */
  getById(courseId) {
    const courses = this.getAll();
    return courses.find(c => c.id === courseId) || null;
  },

  /**
   * Crea un nuevo curso en el catálogo (Exclusivo Admin)
   */
  create(data) {
    const courses = this.getAll();
    const slugId = (data.code || `curso-${Date.now()}`)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-');

    const newCourse = {
      id: slugId,
      title: data.title || 'Nueva Capacitación Upstream',
      category: data.category || 'Operaciones de Campo',
      code: data.code || 'VM-NEW-01',
      duration: data.duration || '40 Horas',
      modality: data.modality || 'Virtual + Tutoría Sincrónica',
      basePrice: Number(data.basePrice) || 350000,
      badge: data.badge || 'Nuevo Programa 2026',
      rating: 5.0,
      studentsCount: 0,
      status: data.status || 'active', // 'active' | 'paused' | 'hidden'
      image: data.image || 'https://victorparedes.ar/th_tendido.jpg',
      description: data.description || 'Programa de formación técnica especializada para yacimientos de la Cuenca Neuquina.',
      modules: data.modules || [
        {
          id: `mod-${Date.now()}-1`,
          title: "Módulo 1: Fundamentos y Procedimientos Operativos",
          lessons: [
            {
              id: `les-${Date.now()}-1`,
              title: "Introducción y Criterios de Seguridad en Locación",
              duration: "30 min",
              type: "theory",
              summary: "Marco general y protocolos de trabajo seguro en Vaca Muerta.",
              content: "Contenido inicial del módulo.",
              checklist: ["Inspección visual de área", "Verificación de EPP"]
            }
          ]
        }
      ]
    };

    courses.push(newCourse);
    storageService.set('courses', courses);
    return newCourse;
  },

  /**
   * Actualiza los datos de un curso existente (Exclusivo Admin)
   */
  update(courseId, data) {
    const courses = this.getAll();
    const index = courses.findIndex(c => c.id === courseId);
    if (index === -1) throw new Error('Curso no encontrado.');

    courses[index] = {
      ...courses[index],
      title: data.title !== undefined ? data.title : courses[index].title,
      code: data.code !== undefined ? data.code : courses[index].code,
      category: data.category !== undefined ? data.category : courses[index].category,
      duration: data.duration !== undefined ? data.duration : courses[index].duration,
      modality: data.modality !== undefined ? data.modality : courses[index].modality,
      badge: data.badge !== undefined ? data.badge : courses[index].badge,
      image: data.image !== undefined ? data.image : courses[index].image,
      description: data.description !== undefined ? data.description : courses[index].description,
      basePrice: data.basePrice !== undefined ? Number(data.basePrice) : courses[index].basePrice,
      status: data.status !== undefined ? data.status : (courses[index].status || 'active')
    };

    storageService.set('courses', courses);
    return courses[index];
  },

  /**
   * Alterna el estado de pausa de inscripciones de un curso ('active' <-> 'paused')
   */
  togglePause(courseId) {
    const courses = this.getAll();
    const index = courses.findIndex(c => c.id === courseId);
    if (index === -1) throw new Error('Curso no encontrado.');

    const currentStatus = courses[index].status || 'active';
    courses[index].status = currentStatus === 'paused' ? 'active' : 'paused';
    storageService.set('courses', courses);
    return courses[index];
  },

  /**
   * Alterna la visibilidad en el catálogo ('hidden' <-> 'active')
   */
  toggleVisibility(courseId) {
    const courses = this.getAll();
    const index = courses.findIndex(c => c.id === courseId);
    if (index === -1) throw new Error('Curso no encontrado.');

    const currentStatus = courses[index].status || 'active';
    courses[index].status = currentStatus === 'hidden' ? 'active' : 'hidden';
    storageService.set('courses', courses);
    return courses[index];
  },

  /**
   * Elimina un curso del catálogo oficial
   */
  delete(courseId) {
    const courses = this.getAll();
    const updated = courses.filter(c => c.id !== courseId);
    if (updated.length === courses.length) return false;

    storageService.set('courses', updated);
    return true;
  },

  /**
   * Actualiza el valor arancelario oficial de un curso
   */
  updatePrice(courseId, newPrice) {
    const numPrice = Number(newPrice);
    if (isNaN(numPrice) || numPrice < 0) {
      throw new Error('El precio arancelario debe ser un número positivo.');
    }

    const courses = this.getAll();
    const index = courses.findIndex(c => c.id === courseId);
    if (index === -1) throw new Error('Curso no encontrado.');

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
   * Alterna el estado de una lección (completada / pendiente)
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

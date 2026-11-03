/**
 * Vaca Muerta Consulting - Storage Service
 * Abstracción de persistencia local (localStorage) inspirada en los repositorios de Frappe.
 * Diseñada para permitir migración transparente a Supabase, Firebase o API REST de Frappe.
 */

import { INITIAL_DATA } from '../data/seedData.js';
import { remoteStore } from './supabaseClient.js';

const STORAGE_KEY_PREFIX = 'vmc_lms_';

// Memoria fallback en caso de navegación privada estricta o sandbox sin localStorage
const memoryStore = new Map();

function isLocalStorageAvailable() {
  try {
    const testKey = '__vmc_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

const hasLocal = isLocalStorageAvailable();

// Escritura en la base compartida habilitada solo con sesión de administrador verificada
let remoteWritable = false;

function emit(name, detail) {
  try { window.dispatchEvent(new CustomEvent(name, { detail })); } catch (e) { /* sin DOM */ }
}

export const storageService = {
  /**
   * Inicializa las colecciones en el almacenamiento si no existen
   */
  init() {
    const initialized = this.get('initialized');
    const version = this.get('version');
    if (!initialized || version !== '2.4.0') {
      this.resetToDefaults();
    }
  },

  /**
   * Restablece la base de datos a los valores semilla originales
   */
  resetToDefaults() {
    this.set('settings', INITIAL_DATA.settings);
    this.set('courses', INITIAL_DATA.courses, { remote: false });
    this.set('cohorts', INITIAL_DATA.cohorts, { remote: false });
    this.set('coordinators', INITIAL_DATA.coordinators);
    this.set('users', INITIAL_DATA.users);
    this.set('initialized', true);
    this.set('version', '2.4.0');
    console.log('[StorageService] Base de datos reinicializada con versión 2.4.0 de Vaca Muerta Consulting.');
  },

  /**
   * Habilita o deshabilita la publicación de cambios en la base compartida
   */
  setRemoteWritable(value) {
    remoteWritable = !!value;
  },

  /**
   * Trae cursos y cohortes de la base compartida. Si la base está vacía y hay
   * sesión de administrador, publica el catálogo inicial.
   */
  async syncFromRemote() {
    for (const key of ['courses', 'cohorts']) {
      const items = await remoteStore.fetchCollection(key);
      if (items === null) continue;
      if (items.length > 0) {
        this.set(key, items, { remote: false });
      } else if (remoteWritable) {
        const local = this.get(key) || INITIAL_DATA[key] || [];
        await remoteStore.saveCollection(key, local);
      }
    }
  },

  /**
   * Obtiene un registro o colección por clave
   */
  get(key) {
    const fullKey = STORAGE_KEY_PREFIX + key;
    try {
      if (hasLocal) {
        const item = window.localStorage.getItem(fullKey);
        return item ? JSON.parse(item) : null;
      } else {
        return memoryStore.get(fullKey) || null;
      }
    } catch (err) {
      console.error(`[StorageService] Error al leer ${key}:`, err);
      return null;
    }
  },

  /**
   * Guarda un valor serializado en JSON
   */
  set(key, value, { remote = true } = {}) {
    const fullKey = STORAGE_KEY_PREFIX + key;
    if (remote && remoteWritable && remoteStore.isShared(key)) {
      remoteStore.saveCollection(key, value)
        .then(() => emit('vmc:remote-saved', { key }))
        .catch(err => emit('vmc:remote-error', { key, message: err.message }));
    }
    try {
      if (hasLocal) {
        window.localStorage.setItem(fullKey, JSON.stringify(value));
      } else {
        memoryStore.set(fullKey, value);
      }
      return true;
    } catch (err) {
      console.error(`[StorageService] Error al guardar ${key}:`, err);
      return false;
    }
  },

  /**
   * Remueve una clave
   */
  remove(key) {
    const fullKey = STORAGE_KEY_PREFIX + key;
    if (hasLocal) {
      window.localStorage.removeItem(fullKey);
    } else {
      memoryStore.delete(fullKey);
    }
  },

  /**
   * Exporta todo el estado de la aplicación en formato JSON (Backup)
   */
  exportData() {
    return {
      settings: this.get('settings'),
      courses: this.get('courses'),
      cohorts: this.get('cohorts'),
      coordinators: this.get('coordinators'),
      users: this.get('users'),
      exportedAt: new Date().toISOString()
    };
  },

  /**
   * Importa un JSON de respaldo
   */
  importData(backupObject) {
    if (!backupObject || typeof backupObject !== 'object') {
      throw new Error('Formato de respaldo inválido.');
    }
    if (backupObject.courses) this.set('courses', backupObject.courses);
    if (backupObject.cohorts) this.set('cohorts', backupObject.cohorts);
    if (backupObject.coordinators) this.set('coordinators', backupObject.coordinators);
    if (backupObject.users) this.set('users', backupObject.users);
    if (backupObject.settings) this.set('settings', backupObject.settings);
    return true;
  }
};

// Auto-inicializar al importar
storageService.init();

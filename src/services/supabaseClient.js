/**
 * Vaca Muerta Consulting - Cliente Supabase
 * La clave publicable es pública por diseño: los permisos reales los controlan
 * las políticas RLS de la base (lectura pública del catálogo, escritura solo admin).
 */

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

export const SUPABASE_URL = 'https://iczcnnmajpmyjuukniwj.supabase.co';
export const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_QgTsJUkFq00g0HoLhZKziQ_SJwcHEbP';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true }
});

const SHARED_TABLES = { courses: 'courses', cohorts: 'cohorts' };

export const remoteStore = {
  isShared(key) {
    return Object.prototype.hasOwnProperty.call(SHARED_TABLES, key);
  },

  /** Lee una colección compartida ordenada. Devuelve null si falla. */
  async fetchCollection(key) {
    const table = SHARED_TABLES[key];
    const { data, error } = await supabase.from(table).select('id, data, sort_order').order('sort_order');
    if (error) {
      console.error(`[Supabase] Error al leer ${table}:`, error.message);
      return null;
    }
    return data.map(r => r.data);
  },

  /**
   * Guarda la colección completa: upsert de los elementos y borrado de los que ya no están.
   * Solo funciona con sesión de administrador (RLS).
   */
  async saveCollection(key, items) {
    const table = SHARED_TABLES[key];
    const rows = (items || []).map((item, i) => ({ id: item.id, data: item, sort_order: i }));
    if (rows.length) {
      const { error } = await supabase.from(table).upsert(rows, { onConflict: 'id' });
      if (error) throw new Error(error.message);
    }
    const ids = rows.map(r => r.id);
    let del = supabase.from(table).delete();
    del = ids.length ? del.not('id', 'in', `(${ids.map(id => `"${id}"`).join(',')})`) : del.neq('id', '');
    const { error: delError } = await del;
    if (delError) throw new Error(delError.message);
  },

  async isAdmin() {
    const { data, error } = await supabase.rpc('is_admin');
    if (error) return false;
    return data === true;
  }
};

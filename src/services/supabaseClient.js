/**
 * Vaca Muerta Consulting - Cliente Supabase
 * La clave publicable es pública por diseño: los permisos reales los controlan
 * las políticas RLS de la base (lectura pública del catálogo, escritura solo admin).
 *
 * La librería se carga bajo demanda: si no se puede descargar, el sitio sigue
 * funcionando con el catálogo incluido en la web (solo lectura).
 */

export const SUPABASE_URL = 'https://iczcnnmajpmyjuukniwj.supabase.co';
export const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_QgTsJUkFq00g0HoLhZKziQ_SJwcHEbP';
const SUPABASE_JS_URL = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm';

let clientPromise = null;

export function getSupabase() {
  if (!clientPromise) {
    clientPromise = import(SUPABASE_JS_URL)
      .then(({ createClient }) => createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
        auth: { persistSession: true, autoRefreshToken: true }
      }))
      .catch(err => {
        console.error('[Supabase] No se pudo cargar la librería:', err);
        clientPromise = null;
        return null;
      });
  }
  return clientPromise;
}

const SHARED_TABLES = { courses: 'courses', cohorts: 'cohorts' };

export const remoteStore = {
  isShared(key) {
    return Object.prototype.hasOwnProperty.call(SHARED_TABLES, key);
  },

  /** Lee una colección compartida ordenada. Devuelve null si falla. */
  async fetchCollection(key) {
    const supabase = await getSupabase();
    if (!supabase) return null;
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
    const supabase = await getSupabase();
    if (!supabase) throw new Error('Sin conexión con la base de datos');
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
    const supabase = await getSupabase();
    if (!supabase) return false;
    const { data, error } = await supabase.rpc('is_admin');
    if (error) return false;
    return data === true;
  }
};

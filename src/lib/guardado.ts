/** Recordar nombre y etapa en este dispositivo (comodidad; si el storage falla, no pasa nada). */
const CLAVE = 'ada-grupal:perfil';

export function leerPerfil(): { nombre: string; etapa: string } {
  try {
    const raw = localStorage.getItem(CLAVE);
    if (!raw) return { nombre: '', etapa: '' };
    const p = JSON.parse(raw);
    return { nombre: typeof p.nombre === 'string' ? p.nombre : '', etapa: typeof p.etapa === 'string' ? p.etapa : '' };
  } catch {
    return { nombre: '', etapa: '' };
  }
}

export function guardarPerfil(nombre: string, etapa: string) {
  try { localStorage.setItem(CLAVE, JSON.stringify({ nombre, etapa })); } catch { /* sin storage */ }
}

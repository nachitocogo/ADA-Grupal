import { CLASE } from '../data/clase';

const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

/**
 * Próxima clase (inicio) como instante absoluto. Si la clase de hoy está en curso,
 * devuelve la de hoy, para que la página muestre "en vivo" en vez de saltar a la semana siguiente.
 */
export function proximaClase(ahora = new Date()): Date {
  const offMs = CLASE.utcOffsetHoras * 3600_000;
  // "Reloj de Argentina" representado en campos UTC
  const local = new Date(ahora.getTime() + offMs);
  const inicio = new Date(Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate(), CLASE.hora, CLASE.minuto));
  let dias = (CLASE.diaSemana - local.getUTCDay() + 7) % 7;
  const finHoy = inicio.getTime() + CLASE.duracionMin * 60_000;
  if (dias === 0 && local.getTime() >= finHoy) dias = 7;
  inicio.setUTCDate(inicio.getUTCDate() + dias);
  // Saltear los jueves marcados sin clase (máximo un año, por si la lista tiene un error)
  for (let i = 0; i < 52 && CLASE.sinClase.includes(inicio.toISOString().slice(0, 10)); i++) {
    inicio.setUTCDate(inicio.getUTCDate() + 7);
  }
  return new Date(inicio.getTime() - offMs);
}

/** "jueves 23 de octubre" (en hora de Argentina). */
export function fechaLarga(d: Date): string {
  const local = new Date(d.getTime() + CLASE.utcOffsetHoras * 3600_000);
  return `${DIAS[local.getUTCDay()]} ${local.getUTCDate()} de ${MESES[local.getUTCMonth()]}`;
}

export const diaClase = DIAS[CLASE.diaSemana];
export const horaClase = `${CLASE.hora}${CLASE.minuto ? `:${String(CLASE.minuto).padStart(2, '0')}` : ''}\u00a0hs`;

export type Cuenta = { enVivo: boolean; d: number; h: number; m: number };

export function cuentaRegresiva(inicio: Date, ahora = new Date()): Cuenta {
  const diff = inicio.getTime() - ahora.getTime();
  if (diff <= 0) return { enVivo: true, d: 0, h: 0, m: 0 };
  const min = Math.floor(diff / 60_000);
  return { enVivo: false, d: Math.floor(min / 1440), h: Math.floor((min % 1440) / 60), m: min % 60 };
}

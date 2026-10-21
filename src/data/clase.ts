/**
 * Datos de la clase grupal. Si cambia el día o la hora, se toca solo acá.
 * Confirmado por Nacho el 21/10/2026: todos los jueves a las 19 hs (hora Argentina), queda grabada.
 *
 * La fecha NO se carga a mano: cada vez que alguien abre la página, el navegador calcula el
 * próximo jueves 19 hs. Mientras la clase está en curso muestra "En vivo"; cuando termina
 * (inicio + duracionMin) pasa sola al jueves siguiente. Ver lib/clase.ts.
 */
export const CLASE = {
  /** 0 = domingo … 4 = jueves */
  diaSemana: 4,
  hora: 19,
  minuto: 0,
  /** Argentina no tiene horario de verano: UTC−3 todo el año. */
  utcOffsetHoras: -3,
  /** Duración aproximada: mientras la clase está en curso, la cuenta regresiva muestra "en vivo". */
  duracionMin: 90,
  quedaGrabada: true,
  /**
   * Jueves en los que NO hay clase (feriados, fiestas, pausas), en formato 'AAAA-MM-DD'.
   * La página los saltea y muestra el jueves siguiente. Ej: ['2026-12-24', '2026-12-31'].
   */
  sinClase: [] as string[],
  /** Máximo de preguntas por envío. Con 30-35 personas, más de 3 por alumno no entra en una clase. */
  maxPreguntas: 3,
};

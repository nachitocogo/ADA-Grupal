/**
 * Conexión con el Google Form de siempre ("Dejá tus dudas para la próxima clase en vivo").
 * La web manda las respuestas a ese mismo formulario, así que el equipo las sigue viendo
 * en la misma pestaña de Respuestas / la misma planilla.
 *
 * No hay secretos acá: el ID del formulario ya es público (es el link que se comparte a los alumnos).
 *
 * Campos:
 * - `nombre` y `pregunta` existen hoy en el formulario.
 * - El resto es opcional. Mientras valga `null`, ese dato viaja dentro del texto de `pregunta`
 *   (con etiquetas tipo "Etapa: …"). Si el equipo agrega una pregunta de "Respuesta corta" o
 *   "Párrafo" en el Google Form para ese dato, se pega acá su `entry.XXXX` y pasa a tener su propia
 *   columna en la planilla. Ver README › "Columnas propias en la planilla".
 */
export const FORMULARIO = {
  id: '1FAIpQLSe7WkEtjwPbZOg-AXpRV4SPdo0JdHSQehvWs4zO8SVFBsKyow',
  campos: {
    nombre: 'entry.1904035694',
    pregunta: 'entry.1563159763',
    etapa: null as string | null,
    temas: null as string | null,
    lectura: null as string | null,
    logro: null as string | null,
  },
};

export const urlEnvio = `https://docs.google.com/forms/d/e/${FORMULARIO.id}/formResponse`;
export const urlFormularioGoogle = `https://docs.google.com/forms/d/e/${FORMULARIO.id}/viewform`;

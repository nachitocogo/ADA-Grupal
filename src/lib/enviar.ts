import { ETAPAS, TEMAS, labelDe } from '../data/opciones';
import { FORMULARIO, urlEnvio } from '../data/formulario';

export type Pregunta = { id: number; tema: string; texto: string; contexto: string };
export type Envio = {
  nombre: string;
  etapa: string;
  preguntas: Pregunta[];
  anonima: boolean;
  logro: string;
};

/**
 * Arma los pares campo → valor que recibe el Google Form.
 * Lo que no tiene campo propio (ver data/formulario.ts) viaja dentro del texto de la pregunta,
 * con etiquetas legibles para quien lee la planilla.
 */
export function armarRespuesta(e: Envio): [string, string][] {
  const c = FORMULARIO.campos;
  const etapa = labelDe(ETAPAS, e.etapa);
  const temas = [...new Set(e.preguntas.map((p) => labelDe(TEMAS, p.tema)))].join(', ');
  const lectura = e.anonima ? 'Sin nombre' : 'Con nombre';
  const logro = e.logro.trim();

  const cabecera: string[] = [];
  if (!c.etapa) cabecera.push(`Etapa: ${etapa}`);
  if (!c.lectura) cabecera.push(`Leer: ${lectura.toLowerCase()}`);

  const bloques = e.preguntas.map((p, i) => {
    const lineas = [`Pregunta ${i + 1} · ${labelDe(TEMAS, p.tema)}`, p.texto.trim()];
    if (p.contexto.trim()) lineas.push(`Contexto: ${p.contexto.trim()}`);
    return lineas.join('\n');
  });

  const partes = [cabecera.join('\n'), ...bloques];
  if (logro && !c.logro) partes.push(`Logro de la semana: ${logro}`);

  const pares: [string, string][] = [
    [c.nombre, e.nombre.trim()],
    [c.pregunta, partes.filter(Boolean).join('\n\n')],
  ];
  if (c.etapa) pares.push([c.etapa, etapa]);
  if (c.temas) pares.push([c.temas, temas]);
  if (c.lectura) pares.push([c.lectura, lectura]);
  if (c.logro && logro) pares.push([c.logro, logro]);
  return pares;
}

/**
 * En `npm run dev` no se manda nada al formulario real (modo prueba), salvo que se arranque con
 * VITE_ENVIAR_REAL=1. El build de producción siempre envía.
 */
export const modoPrueba = import.meta.env.DEV && import.meta.env.VITE_ENVIAR_REAL !== '1';

/**
 * Google Forms no devuelve CORS, así que se envía en modo `no-cors`: la respuesta es opaca.
 * Si la red falla, fetch tira error y se muestra el aviso con el link al formulario de Google.
 */
export async function enviar(pares: [string, string][]): Promise<void> {
  if (modoPrueba) {
    await new Promise((r) => setTimeout(r, 700));
    console.info('[ADA Grupal · modo prueba] No se envió nada. Esto es lo que llegaría al formulario:', Object.fromEntries(pares));
    return;
  }
  const body = new URLSearchParams(pares);
  await fetch(urlEnvio, { method: 'POST', mode: 'no-cors', body });
}

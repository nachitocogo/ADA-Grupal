/**
 * Opciones de los chips. Los `id` son los que llegan a la planilla: si se cambian,
 * cambian también las columnas/filtros que use el equipo.
 */
export type Opcion = { id: string; label: string };

/** Etapa del alumno, con sus palabras (arco de 4 meses, maestro B.15). */
export const ETAPAS: Opcion[] = [
  { id: 'arrancando', label: 'Arrancando: cuentas y billeteras' },
  { id: 'verificado', label: 'Camino al verificado' },
  { id: 'operando', label: 'Operando todos los días' },
  { id: 'clientes', label: 'Buscando o con clientes' },
  { id: 'escalando', label: 'Escalando volumen' },
];

/** Temas para agrupar las preguntas en bloques durante la clase. */
export const TEMAS: Opcion[] = [
  { id: 'cuentas', label: 'Cuentas y billeteras' },
  { id: 'verificado', label: 'El verificado' },
  { id: 'operativa', label: 'Operativa y planilla' },
  { id: 'brechas', label: 'Brechas y precios' },
  { id: 'clientes', label: 'Clientes y captación' },
  { id: 'bloqueos', label: 'Bloqueos y seguridad' },
  { id: 'fiscal', label: 'Certi y fiscal' },
  { id: 'mentalidad', label: 'Mentalidad y organización' },
  { id: 'otro', label: 'Otro' },
];

export const labelDe = (lista: Opcion[], id: string) => lista.find((o) => o.id === id)?.label ?? id;

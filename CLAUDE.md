# ADA Grupal — instrucciones para Claude Code

Página estática (Vite + React + TS) donde los alumnos de la Academia de Arbitraje dejan preguntas
para la clase grupal semanal. El envío va directo del navegador al Google Form de la Academia
(`src/data/formulario.ts`); no hay backend propio.

## Si te piden instalarla o publicarla

Seguí [INSTALACION.md](INSTALACION.md) en orden: Paso 1 (Netlify), Paso 2 (verificación con un
envío de prueba), Paso 3 (botón en la página de recursos con `integracion/boton-recursos.html`).

- `netlify.toml` ya define build (`npm run build`), carpeta (`dist`) y Node 22. No los cambies.
- Antes de publicar: `npm install && npm run build` tiene que terminar sin errores.
- Un envío al formulario crea una respuesta real en la planilla del equipo: hacelo solo cuando la
  persona lo pida, con el nombre `PRUEBA - borrar`, y avisale que la borre.

## Reglas

- **No modificar los `entry.XXXX` ni el `id` de `src/data/formulario.ts`** salvo que la persona
  traiga los IDs nuevos del Google Form. Si están mal, las respuestas se pierden sin error visible.
- No agregar secretos, claves ni variables de entorno: el repo es público.
- `npm run dev` corre en modo prueba (no envía). Solo el build de producción envía.
- La fecha de la clase se calcula sola (`src/lib/clase.ts`); día, hora y jueves sin clase se
  configuran en `src/data/clase.ts`.
- Diseño: design system ADA en `src/styles/ada/` (compartido con rADAr-P2P y ADA Send). Sin serif,
  sin itálica, un solo acento dorado.
- Copy: español rioplatense, "vos", directo. Nunca "dólares" cuando es USDT.

# ADA Grupal

Página donde los alumnos de la Academia de Arbitraje dejan sus preguntas antes de la clase grupal
semanal en vivo. Reemplaza la cara del Google Form "Dejá tus dudas para la próxima clase en vivo"
**sin cambiar dónde caen las respuestas**: la página envía a ese mismo formulario, así que el
equipo las sigue viendo en la misma pestaña de Respuestas / la misma planilla.

Qué pide (menos de un minuto):

- Nombre y apellido, y en qué etapa está el alumno (se recuerdan en el dispositivo).
- De 1 a 3 preguntas, cada una con su tema y contexto opcional ("qué probé, qué pasó").
- Si la leemos con nombre o sin nombre.
- Opcional: algo que le salió en la semana, para mencionarlo en la clase.

> **¿Hay que publicarla?** Seguí [INSTALACION.md](INSTALACION.md): Netlify en 10 minutos,
> verificación de que las respuestas llegan a la planilla, y el botón para la página de recursos.

**Fecha de la clase:** se calcula sola en el navegador de cada alumno: siempre muestra el próximo
jueves 19 hs (hora Argentina), "En vivo" durante la clase, y al terminar pasa al jueves siguiente.
Los jueves sin clase se cargan en `src/data/clase.ts` → `sinClase`.

Stack: Vite + React + TypeScript, sitio estático, mismo design system que rADAr-P2P y ADA Send
(`src/styles/ada/`).

## Correr en local

```bash
npm install
npm run dev
```

Abre en `http://localhost:3010`. En `dev` corre en **modo prueba**: no se envía nada al
formulario real, y al final se muestra exactamente lo que llegaría a la planilla. Para probar un
envío real desde local: `VITE_ENVIAR_REAL=1 npm run dev`.

`npm run build` genera `dist/` (este build sí envía). `npm run typecheck` revisa tipos.

## Cómo llegan las respuestas

Configuración en [`src/data/formulario.ts`](src/data/formulario.ts). Hoy el Google Form tiene dos
campos y la página usa los dos:

| Campo del form | Qué recibe |
|---|---|
| Nombre y Apellido | El nombre |
| La pregunta (párrafo) | Todo lo demás, en texto ordenado: etapa, cómo leerla, cada pregunta con su tema y contexto, logro de la semana |

Ejemplo de lo que queda en la celda de la pregunta:

```
Etapa: Camino al verificado
Leer: sin nombre

Pregunta 1 · El verificado
Llevo 22 días operando y no me sale el verificado. ¿Qué reviso primero?
Contexto: Hago 25 ops por día con montos variados.

Pregunta 2 · Clientes y captación
Mandé 60 mensajes y nadie respondió. ¿Qué cambio del mensaje?

Logro de la semana: Hice mi primera operación.
```

### Columnas propias en la planilla (opcional)

Si el equipo quiere filtrar por etapa o tema en la planilla:

1. En el Google Form, agregar una pregunta de tipo **Respuesta corta** por dato (por ejemplo
   "Etapa", "Temas", "Lectura", "Logro"). Que sea de texto, no de opción múltiple, y **no
   obligatoria**.
2. Menú ⋮ → **Obtener vínculo prellenado**, completar cualquier cosa en esos campos, copiar el
   vínculo. Cada campo aparece como `entry.123456789=...`.
3. Pegar cada `entry.XXXX` en `src/data/formulario.ts` (`etapa`, `temas`, `lectura`, `logro`).

Desde ese momento ese dato va a su columna y sale del texto de la pregunta.

Si alguien edita el Google Form y borra o recrea los campos de Nombre o Pregunta, cambian sus
`entry.XXXX` y hay que actualizarlos acá.

## Cambiar contenido

| Qué | Dónde |
|---|---|
| Día, hora, duración de la clase, jueves sin clase, máximo de preguntas | `src/data/clase.ts` |
| Etapas y temas (chips) | `src/data/opciones.ts` |
| ID del Google Form y campos | `src/data/formulario.ts` |
| Textos de la página | `src/App.tsx` |

## Integración en la central de recursos

Sitio estático, sin backend, sin variables de entorno y sin secretos. Tres opciones:

1. **Enlace directo** a donde se publique (recomendado).
2. **Subcarpeta** (por ejemplo `recursos.dominio.com/grupal/`): `npm run build` y copiar `dist/`.
   Funciona desde cualquier ruta porque usa rutas relativas (`base: './'`) y es una sola pantalla
   (no hay rutas que configurar).
3. **Iframe**: `<iframe src="https://…/grupal/" style="width:100%;height:100vh;border:0"></iframe>`.
   Para un único archivo autocontenido: `npm run build:single` → `dist/index.html`.

Lo único externo que carga son las tipografías de Google Fonts y el envío a `docs.google.com`.

## Seguridad (repo público)

- **Sin secretos en el código.** El ID del Google Form ya es público: es el link que se comparte
  a los alumnos. No hay API keys, tokens ni variables de entorno.
- **Sin lectura de respuestas.** La página solo envía; no puede leer la planilla. Las respuestas
  quedan en el Google Form/Sheet del equipo, con sus permisos de siempre.
- **Anti-spam básico:** campo trampa oculto para bots y límites de largo en cada campo. El riesgo
  de spam es el mismo que tiene hoy el link del Google Form.
- **Datos guardados en el navegador:** solo nombre y etapa, en `localStorage` del propio
  dispositivo, para no tener que escribirlos cada semana.
- `npm audit --omit=dev`: 0 vulnerabilidades (21-oct-2026).
- El repo no incluye licencia: el código es de la Academia y no se otorga permiso de reutilización.

## Botón para la página de recursos

`integracion/boton-recursos.html`: tarjeta y botón con el estilo de ADA, listos para pegar
(instrucciones en INSTALACION.md › Paso 3).

## Estructura

```
src/
  App.tsx              ← pantalla (intro, formulario, confirmación)
  assets/logo-ada.webp ← logo de la Academia (encabezado); favicon y apple-touch-icon en public/
  data/                ← clase, opciones (etapas/temas), conexión al formulario
  lib/                 ← fecha de la próxima clase, armado y envío de la respuesta, guardado local
  styles/ada/          ← design system ADA (igual que rADAr-P2P y ADA Send)
  styles/grupal.css    ← estilos propios
  ui/                  ← Brand, íconos, avisos
```

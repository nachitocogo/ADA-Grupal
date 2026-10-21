# Instalación de ADA Grupal (para Mateo)

Tiempo estimado: 10 minutos. No hay que configurar claves, variables ni base de datos.

## Qué es y cómo funciona (en 4 líneas)

- Es una página estática donde los alumnos dejan sus preguntas para la clase grupal.
- Cuando un alumno envía, **su navegador** manda la respuesta directo al Google Form de la Academia
  ("Dejá tus dudas para la próxima clase en vivo"). No pasa por Netlify ni por ningún servidor nuestro.
- Por eso funciona igual en cualquier Netlify (el tuyo, el de Fran) o en cualquier hosting: las
  respuestas caen en la **misma planilla de respuestas de siempre**.
- La fecha de la próxima clase (jueves 19 hs, hora Argentina) se calcula sola cada vez que alguien
  abre la página. No hay que actualizar nada semana a semana.

## Paso 1 · Publicar en Netlify

1. En Netlify: **Add new project → Import an existing project → GitHub**.
2. Elegir el repo `ADA-Grupal`.
   - Si no aparece en la lista: hacer clic en **Configure Netlify on GitHub** y darle acceso a ese
     repo. Si el primer build falla con "Repository not found", es esto mismo.
3. **No tocar Build settings.** El repo trae `netlify.toml` con todo: comando `npm run build`,
   carpeta `dist`, Node 22.
4. **Deploy.** Tarda menos de un minuto.
5. Opcional: en **Project configuration → Change project name**, ponerle un nombre prolijo
   (por ejemplo `ada-grupal` → `https://ada-grupal.netlify.app`) o conectar un subdominio propio.

> Otra opción en vez de un proyecto aparte de Netlify: correr `npm install && npm run build` y copiar
> el contenido de `dist/` a una subcarpeta de la web de recursos (por ejemplo `/grupal/`). Funciona en
> cualquier ruta, sin redirects.

## Paso 2 · Verificar que las respuestas llegan (obligatorio, 2 minutos)

1. Abrir el link publicado. **No tiene que aparecer** el aviso azul de "Modo prueba local". Si
   aparece, se publicó en modo desarrollo: revisar que el comando sea `npm run build`.
2. Completar una pregunta de prueba con el nombre **`PRUEBA - borrar`** y enviarla. Tiene que
   aparecer la pantalla "Listo, PRUEBA".
3. Pedirle a Nacho o a Fran que miren la planilla de respuestas: en un minuto aparece una fila nueva
   con `PRUEBA - borrar` en "Nombre y Apellido" y el texto ordenado (etapa, tema, pregunta) en la
   columna de la pregunta.
4. Borrar esa fila de prueba (en Google Forms → Respuestas, y en la planilla).

Si la fila no aparece: ver "Si algo no anda", abajo.

## Paso 3 · Botón en la página de recursos

En [`integracion/boton-recursos.html`](integracion/boton-recursos.html) hay dos variantes listas
para pegar, con el estilo de ADA:

- **Tarjeta** (para la grilla de recursos): "Dejá tu pregunta para la próxima clase" + botón
  "Dejar mi pregunta".
- **Solo botón** (para una barra o un menú).

Cómo usarlo:

1. Abrir el archivo en el navegador para ver cómo queda.
2. Copiar el bloque entre `copiar desde acá` y `copiar hasta acá` de la variante que sirva.
3. Reemplazar `URL_DE_ADA_GRUPAL` por el link del Paso 1.
4. Pegarlo en la página de recursos. Todo el CSS usa el prefijo `.adag-`, así que no pisa nada.
   Si la web de recursos está hecha en React, Astro o similar, es el mismo HTML (en React,
   `class` → `className`).

Pasarle el link final a Nacho: él lo pone en el canal de recursos de Discord.

## Lo que se puede cambiar sin programar

| Qué | Archivo | Ejemplo |
|---|---|---|
| Día u hora de la clase | `src/data/clase.ts` → `diaSemana`, `hora` | jueves = 4, `hora: 19` |
| Un jueves sin clase (feriado, fiestas) | `src/data/clase.ts` → `sinClase` | `['2026-12-24', '2026-12-31']` |
| Etapas y temas de los chips | `src/data/opciones.ts` | |
| Formulario de Google al que se envía | `src/data/formulario.ts` | ver README |

Cada cambio: commit y push a `main`; Netlify vuelve a publicar solo.

## Lo que NO hay que tocar

- Los `entry.XXXX` de `src/data/formulario.ts`. Son los IDs de los campos del Google Form. Si se
  cambian, las respuestas dejan de llegar **sin mostrar ningún error al alumno** (Google Forms no
  avisa). Lo mismo si alguien borra y vuelve a crear las preguntas "Nombre y Apellido" o la de la
  pregunta en el Google Form: cambian sus IDs y hay que actualizarlos acá (README › "Columnas propias
  en la planilla" explica cómo obtenerlos).
- No agregar claves, tokens ni variables de entorno: el repo es público y no los necesita.

## Si algo no anda

| Síntoma | Causa probable | Qué hacer |
|---|---|---|
| El build falla con "Repository not found" | Netlify no tiene acceso al repo | Paso 1.2 |
| Aparece "Modo prueba local" en la web publicada | Se publicó `npm run dev` en vez del build | Comando = `npm run build`, carpeta = `dist` |
| La página dice "Listo" pero la fila no llega | El Google Form cambió (campos recreados, o ahora pide iniciar sesión / limita a 1 respuesta) | Revisar el form; actualizar `entry.XXXX`; el form no tiene que pedir login |
| "No se pudo enviar" | Sin conexión del alumno, o un bloqueador de contenido que frena `docs.google.com` | El aviso ofrece el link al Google Form como plan B |
| La fecha de la clase está mal | Cambió el día u hora | `src/data/clase.ts` |

## Para hacerlo con Claude Code

Abrir el repo con Claude Code y pegarle:

> Leé INSTALACION.md y CLAUDE.md de este repo. Ayudame a publicarlo en Netlify siguiendo el Paso 1,
> después guiame con el Paso 2 (verificación) y adaptá el botón de `integracion/boton-recursos.html`
> a nuestra página de recursos (Paso 3) con este link: <link publicado>. No cambies los `entry.XXXX`
> del formulario.

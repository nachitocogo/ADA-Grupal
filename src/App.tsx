import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { CLASE } from './data/clase';
import { ETAPAS, TEMAS, labelDe } from './data/opciones';
import { urlFormularioGoogle } from './data/formulario';
import { cuentaRegresiva, diaClase, fechaLarga, horaClase, proximaClase } from './lib/clase';
import { armarRespuesta, enviar, modoPrueba, type Envio, type Pregunta } from './lib/enviar';
import { guardarPerfil, leerPerfil } from './lib/guardado';
import { Brand } from './ui/Brand';
import { BrandMark, IconArrow, IconPlus, IconX } from './ui/Icons';
import { Notice } from './ui/Notice';

const MAX_TEXTO = 600;
const MAX_CONTEXTO = 400;
const MIN_TEXTO = 12;

const EJEMPLOS = [
  'Ej: Llevo 25 días operando y todavía no me sale el verificado. ¿Qué reviso primero?',
  'Ej: Mandé 60 mensajes esta semana y no me respondió nadie. ¿Qué cambio del mensaje?',
  'Ej: ¿Cómo ordeno la planilla cuando opero con tres billeteras distintas?',
];

let siguienteId = 1;
const nuevaPregunta = (): Pregunta & { verContexto: boolean } => ({ id: siguienteId++, tema: '', texto: '', contexto: '', verContexto: false });

type Estado = 'editando' | 'enviando' | 'ok' | 'error';

export default function App() {
  const perfil = useMemo(leerPerfil, []);
  const [nombre, setNombre] = useState(perfil.nombre);
  const [etapa, setEtapa] = useState(perfil.etapa);
  const [preguntas, setPreguntas] = useState([nuevaPregunta()]);
  const [anonima, setAnonima] = useState(false);
  const [verLogro, setVerLogro] = useState(false);
  const [logro, setLogro] = useState('');
  const [trampa, setTrampa] = useState('');
  const [intento, setIntento] = useState(false);
  const [estado, setEstado] = useState<Estado>('editando');
  const [enviado, setEnviado] = useState<{ envio: Envio; pares: [string, string][] } | null>(null);

  const [ahora, setAhora] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setAhora(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);
  const inicio = proximaClase(ahora);
  const cuenta = cuentaRegresiva(inicio, ahora);
  const fecha = fechaLarga(inicio);

  const errores = {
    nombre: nombre.trim().length < 3 ? 'Poné tu nombre y apellido.' : '',
    etapa: etapa ? '' : 'Elegí en qué etapa estás.',
    preguntas: preguntas.map((p) => ({
      tema: p.tema ? '' : 'Elegí un tema.',
      texto: p.texto.trim().length < MIN_TEXTO ? 'Escribí la pregunta completa.' : '',
    })),
  };
  const valido = !errores.nombre && !errores.etapa && errores.preguntas.every((e) => !e.tema && !e.texto);

  const primerError = useRef<HTMLDivElement>(null);

  const actualizar = (id: number, cambio: Partial<Pregunta & { verContexto: boolean }>) =>
    setPreguntas((ps) => ps.map((p) => (p.id === id ? { ...p, ...cambio } : p)));

  async function onSubmit(ev: FormEvent) {
    ev.preventDefault();
    setIntento(true);
    if (!valido) {
      requestAnimationFrame(() => {
        document.querySelector('[data-error="true"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
      return;
    }
    const envio: Envio = {
      nombre,
      etapa,
      anonima,
      logro: verLogro ? logro : '',
      preguntas: preguntas.map(({ id, tema, texto, contexto, verContexto }) => ({ id, tema, texto, contexto: verContexto ? contexto : '' })),
    };
    const pares = armarRespuesta(envio);
    guardarPerfil(nombre.trim(), etapa);
    setEstado('enviando');
    try {
      // Campo trampa para bots: si viene lleno, se simula el envío y no se manda nada.
      if (!trampa) await enviar(pares);
      setEnviado({ envio, pares });
      setEstado('ok');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setEstado('error');
    }
  }

  function otraVez() {
    setPreguntas([nuevaPregunta()]);
    setLogro('');
    setVerLogro(false);
    setIntento(false);
    setEnviado(null);
    setEstado('editando');
  }

  const nPreg = preguntas.length;
  const textoBoton = estado === 'enviando' ? 'Enviando…' : nPreg === 1 ? 'Enviar mi pregunta' : `Enviar mis ${nPreg} preguntas`;

  return (
    <>
      <header className="topbar">
        <div className="container">
          <span className="brand" aria-label="ADA Grupal">
            <BrandMark />
            <span>
              <span className="brand-name"><Brand size="sm" /></span>
              <span className="brand-sub"><b>A</b>cademia <b>D</b>e <b>A</b>rbitraje</span>
            </span>
          </span>
          <span className="rev-pill">Próxima clase <b>{fecha} · {horaClase}</b></span>
        </div>
      </header>

      <main className="page">
        <div className="container grupal">
          <div className="lado">
          <section className="intro fade-up">
            <p className="eyebrow">Clase grupal en vivo</p>
            <h1 className="intro-title">
              Tu pregunta, en la clase del <span className="gold">{diaClase}</span>
            </h1>
            <p className="intro-lead">
              Las leemos antes de la clase y las ordenamos por tema. Así en una hora entran las de todos, y lo que preguntás vos también le sirve al resto.
            </p>

            <div className="clase" aria-live="polite">
              <div className="clase-cell">
                <span className="clase-k">Próxima clase</span>
                <span className="clase-v">{fecha}</span>
                <span className="clase-d">{horaClase} · hora Argentina</span>
              </div>
              <div className="clase-cell">
                <span className="clase-k">{cuenta.enVivo ? 'Estado' : 'Empieza en'}</span>
                {cuenta.enVivo ? (
                  <span className="clase-v gold">En vivo</span>
                ) : (
                  <span className="clase-v mono">
                    {cuenta.d > 0 ? <>{cuenta.d}<small>d</small> </> : null}
                    {String(cuenta.h).padStart(2, '0')}<small>h</small> {String(cuenta.m).padStart(2, '0')}<small>m</small>
                  </span>
                )}
                <span className="clase-d">{CLASE.quedaGrabada ? 'Queda grabada' : ' '}</span>
              </div>
            </div>
          </section>

          <section className="como fade-up d2" aria-labelledby="como-t">
            <h2 id="como-t" className="como-title">Cómo las usamos</h2>
            <dl className="como-list">
              <div>
                <dt>Por tema</dt>
                <dd>Juntamos las que se parecen y arrancamos por lo que más se repite.</dd>
              </div>
              <div>
                <dt>Concretas primero</dt>
                <dd>Una pregunta con contexto ("hice esto, pasó esto") se responde mejor que un tema suelto.</dd>
              </div>
              <div>
                <dt>Tu caso puntual</dt>
                <dd>Si depende de tu cuenta, un bloqueo o tus números, escribilo también en tu canal privado: ahí se mira con tus datos.</dd>
              </div>
            </dl>
          </section>
          </div>

          <section className="panel fade-up d1" aria-label="Formulario">
            {estado === 'ok' && enviado ? (
              <Recibido envio={enviado.envio} pares={enviado.pares} fecha={fecha} onOtra={otraVez} />
            ) : (
              <form className="card form" onSubmit={onSubmit} noValidate>
                {modoPrueba ? (
                  <Notice kind="info" className="prueba">
                    <b>Modo prueba local.</b> Lo que envíes acá no llega al formulario: se muestra al final cómo quedaría en la planilla.
                  </Notice>
                ) : null}

                <fieldset className="f-sec">
                  <legend className="f-legend">Vos</legend>
                  <div className="field" data-error={intento && !!errores.nombre}>
                    <label htmlFor="nombre">Nombre y apellido</label>
                    <div className="input input-text">
                      <input id="nombre" name="nombre" autoComplete="name" value={nombre} maxLength={80}
                        onChange={(e) => setNombre(e.target.value)} placeholder="Como figurás en la Academia" />
                    </div>
                    {intento && errores.nombre ? <p className="err">{errores.nombre}</p> : null}
                  </div>

                  <div className="field" data-error={intento && !!errores.etapa}>
                    <span className="f-label" id="etapa-l">¿En qué etapa estás?</span>
                    <div className="chips" role="radiogroup" aria-labelledby="etapa-l">
                      {ETAPAS.map((o) => (
                        <button type="button" key={o.id} role="radio" aria-checked={etapa === o.id}
                          className={`chip ${etapa === o.id ? 'on' : ''}`} onClick={() => setEtapa(o.id)}>
                          {o.label}
                        </button>
                      ))}
                    </div>
                    {intento && errores.etapa ? <p className="err">{errores.etapa}</p> : null}
                  </div>
                </fieldset>

                <fieldset className="f-sec">
                  <legend className="f-legend">{nPreg === 1 ? 'Tu pregunta' : 'Tus preguntas'}</legend>
                  {preguntas.map((p, i) => {
                    const e = errores.preguntas[i];
                    return (
                      <div className="q" key={p.id} data-error={intento && !!(e.tema || e.texto)}>
                        {nPreg > 1 ? (
                          <div className="q-head">
                            <span className="q-n">Pregunta {i + 1}</span>
                            <button type="button" className="q-del" onClick={() => setPreguntas((ps) => ps.filter((x) => x.id !== p.id))}
                              aria-label={`Quitar pregunta ${i + 1}`}>
                              <IconX /> Quitar
                            </button>
                          </div>
                        ) : null}

                        <span className="f-label" id={`tema-${p.id}`}>¿De qué tema?</span>
                        <div className="chips" role="radiogroup" aria-labelledby={`tema-${p.id}`}>
                          {TEMAS.map((o) => (
                            <button type="button" key={o.id} role="radio" aria-checked={p.tema === o.id}
                              className={`chip ${p.tema === o.id ? 'on' : ''}`} onClick={() => actualizar(p.id, { tema: o.id })}>
                              {o.label}
                            </button>
                          ))}
                        </div>
                        {intento && e.tema ? <p className="err">{e.tema}</p> : null}

                        <label className="f-label q-label-texto" htmlFor={`texto-${p.id}`}>La pregunta</label>
                        <textarea id={`texto-${p.id}`} className="ta" rows={4} maxLength={MAX_TEXTO} value={p.texto}
                          placeholder={EJEMPLOS[i % EJEMPLOS.length]} onChange={(ev) => actualizar(p.id, { texto: ev.target.value })} />
                        <div className="ta-foot">
                          {intento && e.texto ? <p className="err">{e.texto}</p> : <span className="ta-hint">Una pregunta concreta, no un tema suelto.</span>}
                          <span className="ta-count mono">{p.texto.length}/{MAX_TEXTO}</span>
                        </div>

                        {p.verContexto ? (
                          <div className="field ctx">
                            <label htmlFor={`ctx-${p.id}`}>Contexto <span className="opc">opcional</span></label>
                            <textarea id={`ctx-${p.id}`} className="ta" rows={3} maxLength={MAX_CONTEXTO} value={p.contexto}
                              placeholder="Qué querés lograr, qué probaste y qué pasó."
                              onChange={(ev) => actualizar(p.id, { contexto: ev.target.value })} />
                          </div>
                        ) : (
                          <button type="button" className="btn-link add-ctx" onClick={() => actualizar(p.id, { verContexto: true })}>
                            <IconPlus /> Sumar contexto
                          </button>
                        )}
                      </div>
                    );
                  })}

                  {nPreg < CLASE.maxPreguntas ? (
                    <button type="button" className="btn btn-ghost btn-block add-q" onClick={() => setPreguntas((ps) => [...ps, nuevaPregunta()])}>
                      <IconPlus /> Sumar otra pregunta
                    </button>
                  ) : (
                    <p className="ta-hint tope">Hasta {CLASE.maxPreguntas} por clase, para que entren las de todos.</p>
                  )}
                </fieldset>

                <fieldset className="f-sec">
                  <legend className="f-legend">En la clase</legend>
                  <div className="lectura" role="radiogroup" aria-label="Cómo leemos tu pregunta">
                    <button type="button" role="radio" aria-checked={!anonima} className={`opt ${!anonima ? 'on' : ''}`} onClick={() => setAnonima(false)}>
                      <span className="opt-title"><span className="chk" />Con mi nombre</span>
                      <span className="opt-desc">La leemos y te nombramos.</span>
                    </button>
                    <button type="button" role="radio" aria-checked={anonima} className={`opt ${anonima ? 'on' : ''}`} onClick={() => setAnonima(true)}>
                      <span className="opt-title"><span className="chk" />Sin nombre</span>
                      <span className="opt-desc">La leemos sin decir de quién es.</span>
                    </button>
                  </div>

                  {verLogro ? (
                    <div className="field logro">
                      <label htmlFor="logro">Algo que te salió esta semana <span className="opc">opcional</span></label>
                      <textarea id="logro" className="ta" rows={3} maxLength={MAX_CONTEXTO} value={logro}
                        placeholder="Tu primera operación, el verificado, un cliente nuevo…" onChange={(e) => setLogro(e.target.value)} />
                    </div>
                  ) : (
                    <button type="button" className="logro-cta" onClick={() => setVerLogro(true)}>
                      <span>
                        <b>¿Te salió algo esta semana?</b>
                        <span>Tu primera operación, el verificado, un cliente nuevo. Lo contamos en la clase.</span>
                      </span>
                      <IconPlus />
                    </button>
                  )}
                </fieldset>

                <div className="trampa" aria-hidden="true">
                  <label htmlFor="sitio">No completar</label>
                  <input id="sitio" tabIndex={-1} autoComplete="off" value={trampa} onChange={(e) => setTrampa(e.target.value)} />
                </div>

                <div className="f-send" ref={primerError}>
                  {estado === 'error' ? (
                    <Notice kind="stop" title="No se pudo enviar">
                      Revisá la conexión y probá de nuevo. Si sigue fallando, mandala por el <a href={urlFormularioGoogle} target="_blank" rel="noopener noreferrer">formulario de Google</a>.
                    </Notice>
                  ) : null}
                  <button type="submit" className="btn btn-gold btn-lg btn-block" disabled={estado === 'enviando'}>
                    {textoBoton} <IconArrow />
                  </button>
                  {intento && !valido ? <p className="err center">Falta completar algo arriba.</p> : null}
                </div>
              </form>
            )}
          </section>
        </div>
      </main>

      <footer className="footer footer-grupal">
        <div className="container">
          <span><Brand size="sm" /> · <b>A</b>cademia <b>D</b>e <b>A</b>rbitraje</span>
        </div>
      </footer>
    </>
  );
}

function Recibido({ envio, pares, fecha, onOtra }: { envio: Envio; pares: [string, string][]; fecha: string; onOtra: () => void }) {
  const n = envio.preguntas.length;
  const primerNombre = envio.nombre.trim().split(/\s+/)[0];
  return (
    <div className="card card-gold recibido fade-up">
      <p className="eyebrow">Recibida</p>
      <h2 className="recibido-title">Listo, {primerNombre}</h2>
      <p className="recibido-sub">
        {n === 1 ? 'Tu pregunta ya está' : `Tus ${n} preguntas ya están`} en la lista del <b>{fecha}, {horaClase}</b>.
        {envio.anonima ? ' La leemos sin tu nombre.' : ''}
      </p>

      <ul className="recibido-list">
        {envio.preguntas.map((p) => (
          <li key={p.id}>
            <span className="tag tag-gold">{labelDe(TEMAS, p.tema)}</span>
            <p>{p.texto.trim()}</p>
          </li>
        ))}
      </ul>

      {modoPrueba ? (
        <div className="prueba-salida">
          <Notice kind="info"><b>Modo prueba.</b> No se envió nada. Así llegaría al formulario de Google:</Notice>
          <pre className="mono">{pares.map(([k, v]) => `${k}\n${v}`).join('\n\n')}</pre>
        </div>
      ) : null}

      <button type="button" className="btn btn-soft btn-block" onClick={onOtra}>
        <IconPlus /> Mandar otra pregunta
      </button>
    </div>
  );
}

/**
 * Marca textual del ecosistema ADA. "ADA" (Academia De Arbitraje) siempre va
 * destacado en oro con brillo; el resto del nombre en crema.
 *   <Brand />                       → ADA Grupal
 *   <Brand parts={['r','ADA','r-P2P']} /> → rADAr-P2P (como en Radar)
 * `size` solo cambia el tamaño; el tratamiento es el mismo.
 */
export type BrandPart = string | { ada: true } | { dash: true } | { gap: true };

const DEFAULT: BrandPart[] = [{ ada: true }, { gap: true }, 'Grupal'];

export function Brand({ size = 'md', sub = false, parts = DEFAULT, label = 'ADA Grupal' }: { size?: 'sm' | 'md' | 'hero'; sub?: boolean; parts?: BrandPart[]; label?: string }) {
  return (
    <span className={`brand-word brand-word-${size}`} aria-label={label}>
      {parts.map((p, i) => {
        if (typeof p === 'string') return <span key={i} className="rest">{p}</span>;
        if ('ada' in p) return <span key={i} className="ada">ADA</span>;
        if ('dash' in p) return <span key={i} className="dash">-</span>;
        return <span key={i} className="gap" />;
      })}
      {sub ? (
        <span className="brand-acronym" aria-hidden="true">
          <b>A</b>cademia <b>D</b>e <b>A</b>rbitraje
        </span>
      ) : null}
    </span>
  );
}

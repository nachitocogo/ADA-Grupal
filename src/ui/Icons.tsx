import logoAda from '../assets/logo-ada.webp';

const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

export const IconArrow = () => (<svg viewBox="0 0 24 24" {...base} width="18" height="18"><path d="M5 12h14M13 6l6 6-6 6" /></svg>);
export const IconPlus = () => (<svg viewBox="0 0 24 24" {...base} width="18" height="18"><path d="M12 5v14M5 12h14" /></svg>);
export const IconX = () => (<svg viewBox="0 0 24 24" {...base} width="16" height="16"><path d="M6 6l12 12M18 6 6 18" /></svg>);
export const IconInfo = () => (<svg viewBox="0 0 24 24" {...base}><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></svg>);
export const IconAlert = () => (<svg viewBox="0 0 24 24" {...base}><path d="M12 3.5 21 19.5H3z" /><path d="M12 10v4M12 17h.01" /></svg>);
export const IconOk = () => (<svg viewBox="0 0 24 24" {...base}><circle cx="12" cy="12" r="9" /><path d="m8 12.5 2.8 2.8L16.5 9.5" /></svg>);
export const IconStop = () => (<svg viewBox="0 0 24 24" {...base}><circle cx="12" cy="12" r="9" /><path d="M8.5 8.5l7 7M15.5 8.5l-7 7" /></svg>);

/** Logo de la Academia (escudo con corona). Archivo en src/assets/logo-ada.webp (160 px, recortado del original). */
export const BrandMark = ({ size = 40 }: { size?: number }) => (
  <img className="brand-mark" src={logoAda} width={size} height={size} alt="" aria-hidden="true" decoding="async" />
);

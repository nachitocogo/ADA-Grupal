import type { ReactNode } from 'react';
import { IconAlert, IconInfo, IconOk, IconStop } from './Icons';

export type NoticeKind = 'gold' | 'warn' | 'ok' | 'stop' | 'info' | 'plain';

const ICON: Record<NoticeKind, ReactNode> = {
  gold: <IconInfo />, warn: <IconAlert />, ok: <IconOk />, stop: <IconStop />, info: <IconInfo />, plain: null,
};

/** Aviso con título opcional. `kind` define color e ícono. */
export function Notice({ kind = 'plain', title, children, className = '' }: { kind?: NoticeKind; title?: string; children: ReactNode; className?: string }) {
  return (
    <div className={`notice ${kind !== 'plain' ? `notice-${kind}` : ''} ${className}`} role={kind === 'stop' || kind === 'warn' ? 'alert' : undefined}>
      {ICON[kind]}
      <div className="notice-body">
        {title ? <span className="notice-title">{title}</span> : null}
        {children}
      </div>
    </div>
  );
}

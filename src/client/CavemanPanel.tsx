/**
 * dsh-caveman browser half: the "输出精简" settings section.
 *
 * Drives the host through the command remote (caveman-status / on / off /
 * level) rather than a settings scope, because a plugin-owned settings
 * namespace is not exposed to the browser by the dsh API gateway. The panel
 * keeps a local mirror of enabled/level, refreshed after every command.
 */

import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { LEVELS } from '../constants.ts'
import type { en } from './locales.ts'
import styles from './CavemanPanel.module.css'

/** Injected dependencies of {@link CavemanPanel}. */
export interface CavemanPanelInjected {
  /** Execute a host command (e.g. '/caveman on') and return its result. */
  runCommand: (line: string) => Promise<{ kind: 'success' | 'error'; text: string }>
  /** Panel copy. */
  t: (key: keyof typeof en) => string
}

/** Props delivered by the slot outlet (inject face spread flat). */
export type CavemanPanelProps = Partial<CavemanPanelInjected>

const LEVEL_KEYS = Object.keys(LEVELS) as (keyof typeof LEVELS)[]

/** Human-readable label for a level key. */
function levelLabel(level: string): string {
  return level === 'wenyan-full' ? 'wenyan' : level
}

/** Parse the host `/caveman status` text back into a state pair. */
function parseStatus(text: string): { enabled: boolean; level: string } {
  const on = text.match(/开启（档位\s*(\S+)）/)
  if (on) return { enabled: true, level: on[1] }
  return { enabled: false, level: 'full' }
}

/** Command line helper: prefix a slash so the command remote routes it. */
function cmd(name: string, arg?: string): string {
  return arg !== undefined ? `/${name} ${arg}` : `/${name}`
}

/**
 * Render the Caveman control panel: status, toggle, and level picker.
 * @param props - the inject face (runCommand, copy).
 * @returns the panel content.
 */
export function CavemanPanel(props: CavemanPanelProps): ReactNode {
  const { runCommand, t } = props
  const [enabled, setEnabled] = useState(false)
  const [level, setLevel] = useState<string>('full')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (runCommand === undefined) return
    let alive = true
    void (async () => {
      const result = await runCommand(cmd('caveman-status'))
      if (!alive) return
      const state = parseStatus(result.text)
      setEnabled(state.enabled)
      setLevel(state.level)
    })()
    return () => { alive = false }
  }, [runCommand])

  if (runCommand === undefined || t === undefined) return null

  const act = async (line: string, after: () => void): Promise<void> => {
    setBusy(true)
    setError(null)
    const result = await runCommand(line)
    if (result.kind === 'error') setError(result.text)
    else after()
    setBusy(false)
  }

  const refresh = async (): Promise<void> => {
    const result = await runCommand(cmd('caveman', 'status'))
    const state = parseStatus(result.text)
    setEnabled(state.enabled)
    setLevel(state.level)
  }

  return (
    <section className={styles['section']} aria-label={t('title')}>
      <div className={styles['card']}>
        <div className={styles['row']}>
          <span className={styles['label']}>{t('enabled')}</span>
          <span className={styles['value']}>{enabled ? t('on') : t('off')}</span>
        </div>
        <div className={styles['actions']}>
          <button
            type="button"
            className="dsw-button dsw-button--primary"
            disabled={busy || enabled}
            onClick={() => { void act(cmd('caveman-on'), () => setEnabled(true)) }}
          >
            {t('turnOn')}
          </button>
          <button
            type="button"
            className="dsw-button"
            disabled={busy || !enabled}
            onClick={() => { void act(cmd('caveman-off'), () => setEnabled(false)) }}
          >
            {t('turnOff')}
          </button>
        </div>
      </div>

      <div className={styles['card']}>
        <div className={styles['row']}>
          <span className={styles['label']}>{t('level')}</span>
          <span className={styles['value']}>{levelLabel(level)}</span>
        </div>
        <div className={styles['actions']}>
          {LEVEL_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              className={key === level ? 'dsw-button dsw-button--primary' : 'dsw-button'}
              disabled={busy}
              onClick={() => { void act(cmd('caveman-level', key), () => { setLevel(key); setEnabled(true) }) }}
            >
              {levelLabel(key)}
            </button>
          ))}
        </div>
      </div>

      {error !== null
        ? <div className={styles['warning']}>{error}</div>
        : null}

      <div className={styles['notes']}>
        <span className={styles['notesTitle']}>{t('notes')}</span>
        <span>• {t('noteOutput')}</span>
        <span>• {t('noteTrigger')}</span>
        <span>• {t('noteMeasured')}</span>
      </div>
    </section>
  )
}

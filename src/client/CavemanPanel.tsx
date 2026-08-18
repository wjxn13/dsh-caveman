/**
 * dsh-caveman browser half: the "输出精简" settings section.
 *
 * Presents a global toggle (enabled) and a level picker (lite/full/ultra/
 * wenyan-full). All writes go through the `dsh-caveman` settings scope; the
 * host half reads the same namespace on every request and decides the
 * system-prompt section text.
 */

import type { ReactNode } from 'react'
import type { SettingsScope, SettingsScopeSnapshot } from '@deepseek-ai/dsh-client-runtime/client'
import type { SnapshotSelectorHook } from '@deepseek-ai/dsh-client-web-react'
import { LEVELS } from '../constants.ts'
import type { en } from './locales.ts'
import styles from './CavemanPanel.module.css'

/** The narrowed `dsh-caveman` section this page reads and writes. */
export interface CavemanConfig {
  enabled?: boolean
  level?: string
}

/** Injected dependencies of {@link CavemanPanel}. */
export interface CavemanPanelInjected {
  scope: SettingsScope<CavemanConfig>
  useSnapshot: SnapshotSelectorHook<SettingsScopeSnapshot<CavemanConfig>>
  t: (key: keyof typeof en) => string
}

/** Props delivered by the slot outlet (inject face spread flat). */
export type CavemanPanelProps = Partial<CavemanPanelInjected>

const LEVEL_KEYS = Object.keys(LEVELS) as (keyof typeof LEVELS)[]

/** Human-readable label for a level key. */
function levelLabel(level: string): string {
  return level === 'wenyan-full' ? 'wenyan' : level
}

/**
 * Render the Caveman control panel: status, toggle, and level picker.
 * @param props - the inject face (scope, snapshot hook, copy).
 * @returns the panel content.
 */
export function CavemanPanel(props: CavemanPanelProps): ReactNode {
  const { scope, useSnapshot, t } = props
  if (scope === undefined || useSnapshot === undefined || t === undefined) return null
  const snapshot = useSnapshot((s) => s)
  const enabled = snapshot.value?.enabled === true
  const level = snapshot.value?.level ?? 'full'
  const writable = snapshot.writable === true

  const setEnabled = async (value: boolean): Promise<void> => {
    if (!writable) return
    await scope.set('enabled', value)
  }

  const setLevel = async (value: string): Promise<void> => {
    if (!writable) return
    await scope.set('level', value)
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
            disabled={!writable || enabled}
            onClick={() => { void setEnabled(true) }}
          >
            {t('turnOn')}
          </button>
          <button
            type="button"
            className="dsw-button"
            disabled={!writable || !enabled}
            onClick={() => { void setEnabled(false) }}
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
              disabled={!writable}
              onClick={() => { void setLevel(key) }}
            >
              {levelLabel(key)}
            </button>
          ))}
        </div>
      </div>

      <div className={styles['notes']}>
        <span className={styles['notesTitle']}>{t('notes')}</span>
        <span>• {t('noteOutput')}</span>
        <span>• {t('noteTrigger')}</span>
        <span>• {t('noteMeasured')}</span>
      </div>
    </section>
  )
}

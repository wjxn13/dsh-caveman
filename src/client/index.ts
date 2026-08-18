/**
 * dsh-caveman browser half entry: registers the "输出精简" settings section.
 * The section drives the host through the command remote (caveman-status / on /
 * off / level) instead of the settings scope, because a plugin-owned settings
 * namespace is not exposed to the browser by the dsh API gateway.
 */

import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type {} from '@deepseek-ai/dsh-api-remotes/client'
import { CavemanPanel } from './CavemanPanel.tsx'
import type { CavemanPanelInjected } from './CavemanPanel.tsx'
import { en, zh, type CavemanPanelKey } from './locales.ts'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    'dsh-caveman': CavemanPanelKey
  }
}

const NS = 'dsh-caveman'

export const inject = ['slots', 'locale', 'connection', 'remote', 'sessions']

export function apply(ctx: ClientContext): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'dsh-caveman: copy dictionaries')

  const t = ctx.locale.bind(NS) as CavemanPanelInjected['t']
  const remote = ctx.get('remote') as { commands?: { execute: (line: string) => Promise<unknown> } } | undefined

  const runCommand = async (line: string): Promise<{ kind: 'success' | 'error'; text: string }> => {
    if (remote?.commands?.execute === undefined) {
      return { kind: 'error', text: t('error').replace('{message}', 'host command channel unavailable') }
    }
    try {
      const raw = await remote.commands.execute(line)
      // invoke() returns { ok: true, value: { commandId, result: { kind, text } } } | { ok: false, error }
      const value = (raw as { value?: { result?: { kind?: string; text?: string } } } | undefined)?.value
      const result = value?.result
      if (result?.kind === 'error') {
        return { kind: 'error', text: result.text ?? 'unknown command error' }
      }
      if (result?.kind === 'success') {
        return { kind: 'success', text: result.text ?? '' }
      }
      return { kind: 'error', text: String(raw) }
    } catch (failure) {
      return { kind: 'error', text: failure instanceof Error ? failure.message : String(failure) }
    }
  }

  const injected = (): CavemanPanelInjected => ({ runCommand, t })

  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section',
    id: 'dsh-caveman',
    order: 30,
    label: () => t('nav'),
    inject: injected,
  }, CavemanPanel))
}

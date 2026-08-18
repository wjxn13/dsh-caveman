/**
 * dsh-caveman browser half entry: registers the "输出精简" settings section.
 * The section binds the `dsh-caveman` namespace through the settings scope
 * service and writes `enabled` / `level` — the same hot-reloaded fields the
 * host half reads on every request to decide the system-prompt section text.
 */

import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import { bindSnapshotSelector } from '@deepseek-ai/dsh-client-web-react'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type {} from '@deepseek-ai/dsh-api-remotes/client'
import { CavemanPanel } from './CavemanPanel.tsx'
import type { CavemanConfig, CavemanPanelInjected } from './CavemanPanel.tsx'
import { en, zh, type CavemanPanelKey } from './locales.ts'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    'dsh-caveman': CavemanPanelKey
  }
}

const NS = 'dsh-caveman'

export const inject = ['slots', 'locale', 'connection', 'remote', 'settingsScope']

export function apply(ctx: ClientContext): void {
  console.error('[dsh-caveman client] apply() entered')
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'dsh-caveman: copy dictionaries')

  const connection = (ctx as any).get('connection')
  console.error('[dsh-caveman client] connection present:', connection !== undefined, 'isLoopback:', connection?.isLoopback)

  const scope = ctx.settingsScope.bind<CavemanConfig>({ namespace: 'dsh-caveman' })
  console.error('[dsh-caveman client] bind done, initial snapshot:', JSON.stringify(scope.getSnapshot()))

  setTimeout(() => {
    console.error('[dsh-caveman client] snapshot after 2s:', JSON.stringify(scope.getSnapshot()))
  }, 2000)

  const useSnapshot = bindSnapshotSelector(scope)
  const t = ctx.locale.bind(NS) as CavemanPanelInjected['t']

  const injected = (): CavemanPanelInjected => ({ scope, useSnapshot, t })

  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section',
    id: 'dsh-caveman',
    order: 30,
    label: () => t('nav'),
    inject: injected,
  }, CavemanPanel))
}

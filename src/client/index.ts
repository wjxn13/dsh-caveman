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
import { CavemanPanel } from './CavemanPanel.tsx'
import type { CavemanConfig, CavemanPanelInjected } from './CavemanPanel.tsx'
import { en, zh, type CavemanPanelKey } from './locales.ts'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    'dsh-caveman': CavemanPanelKey
  }
}

const NS = 'dsh-caveman'

export const inject = ['slots', 'locale', 'settingsScope']

export function apply(ctx: ClientContext): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'dsh-caveman: copy dictionaries')

  const scope = ctx.settingsScope.bind<CavemanConfig>({ namespace: 'dsh-caveman' })
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

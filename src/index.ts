/**
 * dsh-caveman host half: a settings-page toggle that injects an output-terseness
 * rule into the model's system prompt.
 *
 * The plugin owns the `dsh-caveman` settings namespace `{ enabled, level }`.
 * A single system-prompt section is registered for the plugin lifetime; its
 * `text` is a provider evaluated at every assembly, so the very next request
 * reflects the live state without re-registering anything. An empty text
 * contributes nothing, which is exactly "off". State lives in settings, so the
 * toggle survives restarts.
 *
 * The namespace is registered through `ctx.inject(["settings"], ...)` — the
 * same timing the official `installSettingsSection` helper uses — because the
 * settings service initializes asynchronously (loads the document before it
 * becomes injectable). Declaring `settings` in the plugin's `inject` array and
 * calling `ctx.settings.register` at the top of `apply()` races that init.
 */

import type { Context } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'
import type {} from '@deepseek-ai/dsh-system-prompt'
import type {} from '@deepseek-ai/dsh-commands'
import type {} from '@deepseek-ai/dsh-settings'
import { DEFAULT_LEVEL, LEVELS, PLUGIN_NAME, SECTION_ORDER, type CavemanLevel } from './constants.ts'

export const name = PLUGIN_NAME
export const inject = ['systemPrompt', 'commands']

interface CavemanConfig {
  enabled: boolean
  level: CavemanLevel
}

const Config = z.object({
  enabled: z.boolean().default(false),
  level: z.union(['lite', 'full', 'ultra', 'wenyan-full']).default(DEFAULT_LEVEL),
})

export function apply(ctx: Context): void {
  console.error('[dsh-caveman] apply() entered')
  let scope: { update: (patch: object) => Promise<void>; get: () => CavemanConfig; watch: (cb: (next: CavemanConfig) => void) => () => void } | undefined
  let state: CavemanConfig = { enabled: false, level: DEFAULT_LEVEL }

  // Register the settings namespace once the settings service is actually
  // ready (async init). Mirrors installSettingsSection's ctx.inject timing.
  ctx.inject(['settings'], (settingsCtx: any) => {
    console.error('[dsh-caveman] ctx.inject settings callback fired')
    scope = settingsCtx.settings.register('dsh-caveman', Config)
    state = scope.get()
    console.error('[dsh-caveman] namespace registered, state=' + JSON.stringify(state))
    scope.watch((next: CavemanConfig) => { state = next })
  })

  ctx.effect(function* () {
    console.error('[dsh-caveman] effect: registering section + commands')
    // One lifetime section; text resolves per assembly from the live state.
    yield ctx.systemPrompt.section({
      name: 'caveman',
      order: SECTION_ORDER,
      text: () => (state.enabled ? LEVELS[state.level] : ''),
    })

    yield ctx.commands.register({
      name: 'caveman-on',
      description: '开启输出精简（caveman 模式）',
      handler: async () => {
        await scope?.update({ enabled: true })
        return { kind: 'success', text: `输出精简已开启（档位 ${state.level}）` }
      },
    })

    yield ctx.commands.register({
      name: 'caveman-off',
      description: '关闭输出精简',
      handler: async () => {
        await scope?.update({ enabled: false })
        return { kind: 'success', text: '输出精简已关闭' }
      },
    })

    yield ctx.commands.register({
      name: 'caveman-level',
      description: '切换档位：lite / full / ultra / wenyan-full',
      handler: async (invocation: any) => {
        const raw = invocation.rawInput.trim().toLowerCase()
        if (!Object.hasOwn(LEVELS, raw)) {
          return { kind: 'error', text: `未知档位「${raw}」，可选：${Object.keys(LEVELS).join(' / ')}` }
        }
        await scope?.update({ level: raw as CavemanLevel, enabled: true })
        return { kind: 'success', text: `档位已切到 ${raw}` }
      },
    })

    yield ctx.commands.register({
      name: 'caveman-status',
      description: '查看输出精简状态',
      handler: async () => {
        const cur = scope !== undefined ? scope.get() : state
        return {
          kind: 'success',
          text: cur.enabled ? `输出精简：开启（档位 ${cur.level}）` : '输出精简：关闭',
        }
      },
    })
  }, 'dsh-caveman lifecycle')
}

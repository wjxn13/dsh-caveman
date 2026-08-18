/**
 * dsh-caveman host half: injects an output-terseness rule into the model's
 * system prompt, driven by commands and persisted to a private state file.
 *
 * WHY COMMANDS, NOT SETTINGS:
 * The dsh API gateway serves only an allowlisted set of settings namespaces to
 * the browser (model-provider namespaces + a hardcoded WEB/PRODUCT allowlist).
 * A plugin-owned namespace like `dsh-caveman` is filtered out with
 * `settings-not-exposed`, so a settings-page toggle can never read or write it.
 * Instead we follow the dsh-headroom pattern: host commands (caveman-on/off/
 * level/status) mutate an in-memory state and persist it to a private JSON file,
 * and the browser half drives them through the command remote.
 */

import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-system-prompt'
import type {} from '@deepseek-ai/dsh-commands'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { homedir } from 'node:os'
import { DEFAULT_LEVEL, LEVELS, PLUGIN_NAME, SECTION_ORDER, type CavemanLevel } from './constants.ts'

export const name = PLUGIN_NAME
export const inject = ['systemPrompt', 'commands']

interface CavemanConfig {
  enabled: boolean
  level: CavemanLevel
}

const DEFAULT_CONFIG: CavemanConfig = { enabled: false, level: DEFAULT_LEVEL }

/** Private state file, outside settings.yaml (which the gateway allowlists). */
function stateDir(): string {
  return join(homedir(), '.dsh-caveman')
}

function stateFile(): string {
  return join(stateDir(), 'state.json')
}

function loadState(): CavemanConfig {
  try {
    if (!existsSync(stateFile())) return { ...DEFAULT_CONFIG }
    const parsed = JSON.parse(readFileSync(stateFile(), 'utf8')) as Partial<CavemanConfig>
    const level = parsed.level !== undefined && Object.hasOwn(LEVELS, parsed.level) ? parsed.level : DEFAULT_LEVEL
    return { enabled: parsed.enabled === true, level }
  } catch {
    return { ...DEFAULT_CONFIG }
  }
}

function saveState(state: CavemanConfig): void {
  try {
    mkdirSync(stateDir(), { recursive: true })
    writeFileSync(stateFile(), JSON.stringify(state, null, 2))
  } catch {
    /* best-effort persistence */
  }
}

export function apply(ctx: Context): void {
  let state: CavemanConfig = loadState()

  const setState = (next: CavemanConfig): void => {
    state = next
    saveState(next)
  }

  ctx.effect(function* () {
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
        setState({ ...state, enabled: true })
        return { kind: 'success', text: `输出精简已开启（档位 ${state.level}）` }
      },
    })

    yield ctx.commands.register({
      name: 'caveman-off',
      description: '关闭输出精简',
      handler: async () => {
        setState({ ...state, enabled: false })
        return { kind: 'success', text: '输出精简已关闭' }
      },
    })

    yield ctx.commands.register({
      name: 'caveman-level',
      description: '切换档位：lite / full / ultra / wenyan-full',
      handler: async (invocation: any) => {
        const raw = String(invocation.rawInput ?? '').trim().toLowerCase()
        if (!Object.hasOwn(LEVELS, raw)) {
          return { kind: 'error', text: `未知档位「${raw}」，可选：${Object.keys(LEVELS).join(' / ')}` }
        }
        setState({ ...state, level: raw as CavemanLevel, enabled: true })
        return { kind: 'success', text: `档位已切到 ${raw}` }
      },
    })

    yield ctx.commands.register({
      name: 'caveman-status',
      description: '查看输出精简状态',
      handler: async () => {
        return {
          kind: 'success',
          text: state.enabled ? `输出精简：开启（档位 ${state.level}）` : '输出精简：关闭',
        }
      },
    })
  }, 'dsh-caveman lifecycle')
}

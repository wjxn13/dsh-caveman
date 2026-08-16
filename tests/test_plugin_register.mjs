// 验证 dsh 插件入口：mock ctx，确认 apply() 会调用 ctx.skills.register()，
// 且注册的 skill 数据正确（name/source/resourceBase/content）。
// 零依赖、零费用、零 dsh 运行环境。
import { pathToFileURL } from 'node:url'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const pluginEntry = resolve(root, 'dsh-plugin', 'index.js')

const registered = []
const warns = []

const ctx = {
  skills: {
    register(skill) {
      registered.push(skill)
      return () => {}
    },
  },
  effect(fn) {
    this._cleanup = fn()
    return () => this._cleanup?.()
  },
  logger: {
    info: () => {},
    warn: (m, ...a) => warns.push([m, ...a]),
  },
}

const mod = await import(pathToFileURL(pluginEntry).href)
mod.apply(ctx)
await new Promise((r) => setTimeout(r, 300))

let ok = true
const fail = (msg) => {
  ok = false
  console.error('FAIL:', msg)
}

console.log('已注册 skill 数量:', registered.length)
if (registered.length === 0) {
  fail('没有调用 ctx.skills.register')
  console.error('warn 日志:', JSON.stringify(warns))
  process.exit(1)
}

const s = registered[0]
console.log('name:', s.name)
console.log('source:', s.source)
console.log('resourceBase:', JSON.stringify(s.resourceBase))
console.log('description 前 70 字:', s.description.slice(0, 70))

if (s.name !== 'dsh-caveman') fail('name 应为 dsh-caveman，实际 ' + s.name)
if (s.source !== 'bundled') fail('source 应为 bundled，实际 ' + s.source)
if (!s.resourceBase || s.resourceBase.kind !== 'directory') fail('resourceBase 应为 directory 形态')
if (!s.description || s.description.length < 10) fail('description 缺失或过短')
if (!s.content || !(s.content.includes('穴居人') || s.content.includes('精简'))) fail('content 应含精简规则正文')

console.log('resourceBase.path:', s.resourceBase?.path)
console.log('content 前 60 字:', s.content.slice(0, 60))

if (ok) {
  console.log('\n✅ 验证通过：插件会正确调用 ctx.skills.register 注册 dsh-caveman skill')
  process.exit(0)
} else {
  process.exit(1)
}

import { readFile, stat } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export const name = 'dsh-caveman'
export const inject = ['skills']

const HERE = dirname(fileURLToPath(import.meta.url))

// 打包后的 skill 目录候选：
//   skills/dsh-caveman     —— npm pack / git 子目录安装（dsh-plugin 内）
//   ../skills/dsh-caveman  —— 直接 clone 仓库后 dsh plugin add ./dsh-plugin
const CANDIDATE_DIRS = ['skills/dsh-caveman', '../skills/dsh-caveman']

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/

// 只解析 name / description 两个标量键（零依赖，不引 YAML 解析器）
function readFrontmatterScalars(block) {
  const out = {}
  const lines = block.split(/\r?\n/)

  for (let i = 0; i < lines.length; i += 1) {
    const match = /^([A-Za-z][\w-]*):[ \t]*(.*)$/.exec(lines[i])
    if (match === null) continue

    const key = match[1]
    const inline = match[2].trim()

    if (inline !== '' && inline !== '>' && inline !== '|' && !inline.startsWith('>') && !inline.startsWith('|')) {
      out[key] = inline.replace(/^['"]|['"]$/g, '')
      continue
    }

    const folded = []
    for (let j = i + 1; j < lines.length; j += 1) {
      const line = lines[j]
      if (line.trim() === '') {
        folded.push('')
        continue
      }
      if (!/^[ \t]/.test(line)) break
      folded.push(line.trim())
      i = j
    }
    const joined = folded.join(' ').replace(/\s+/g, ' ').trim()
    if (joined !== '') out[key] = joined
  }

  return out
}

async function loadPackagedSkill() {
  for (const candidate of CANDIDATE_DIRS) {
    const dir = resolve(HERE, candidate)
    const path = join(dir, 'SKILL.md')

    let raw
    try {
      raw = await readFile(path, 'utf8')
    } catch {
      continue
    }

    const match = FRONTMATTER.exec(raw)
    if (match === null) return undefined

    const { name: skillName, description } = readFrontmatterScalars(match[1])
    if (skillName === undefined || description === undefined) return undefined

    let resourceBase
    try {
      if ((await stat(dir)).isDirectory()) resourceBase = { kind: 'directory', path: dir }
    } catch {
      // 扁平 SKILL.md 也能注册，只是相对链接会失效
    }

    return {
      name: skillName,
      description,
      content: raw.replace(FRONTMATTER, ''),
      source: 'bundled',
      path,
      ...(resourceBase === undefined ? {} : { resourceBase }),
    }
  }

  return undefined
}

export function apply(ctx) {
  if (ctx.skills === undefined) return

  const skills = ctx.skills
  let dispose
  let disposed = false

  ctx.effect(() => {
    loadPackagedSkill()
      .then((skill) => {
        if (disposed || skill === undefined) {
          if (skill === undefined) ctx.logger.warn('dsh-caveman: no readable skill bundle found; nothing registered')
          return
        }
        dispose = skills.register(skill)
        ctx.logger.info('dsh-caveman: registered the "%s" skill', skill.name)
      })
      .catch((e) => {
        ctx.logger.warn('dsh-caveman: failed to register the packaged skill: %o', e)
      })

    return () => {
      disposed = true
      dispose?.()
    }
  })
}

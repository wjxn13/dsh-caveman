/**
 * Shared constants for the dsh-caveman plugin. Kept in a dedicated module so
 * the browser bundle can import level definitions without dragging host-only
 * imports (node: builtins) into the client graph.
 */

/** Plugin identity. */
export const PLUGIN_NAME = 'dsh-caveman'

/** System prompt section order (after persona=0, before tool guidance=100–199). */
export const SECTION_ORDER = 50

/** Output-terseness rule text per level, injected into the system prompt. */
export const LEVELS = {
  lite: '回答要专业紧凑：删掉填充词和不确定表述（其实、大概、可能），保留完整句子结构，直接给结论。',
  full: '像聪明的穴居人一样极简回答：短句、碎片句 OK，用短同义词。删掉客套（好的、没问题）、填充词（其实、就是说）、不确定表述（可能、大概）。不铺垫，直接给结论和代码。技术术语、代码、命令、错误原文保留，一个字不改。绝不删否定词（不/没/只/仅/除）。',
  ultra: '极致精简：一词够就不两词，每事实只述一次，因果明确时删连词。不造缩写。直接给结论。技术术语、代码原文保留。绝不删否定词。',
  'wenyan-full': '用文言文回答，最大精简。文言句式，动宾前置，主语常省，用文言虚词（之/乃/为/其）。技术术语、代码原文保留。',
} as const

export type CavemanLevel = keyof typeof LEVELS

export const DEFAULT_LEVEL: CavemanLevel = 'full'

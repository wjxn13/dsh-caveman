/**
 * dsh-caveman copy dictionaries (zh + en). The panel is a settings page, so
 * its strings live in one namespace owned by this plugin.
 */

export const zh = {
  'nav': '输出精简',
  'title': 'Caveman 输出精简',
  'description': '让 AI 少说废话，节省输出 token。开关热生效，下一次请求即应用。',
  'enabled': '当前状态',
  'on': '已开启',
  'off': '已关闭',
  'turnOn': '开启精简',
  'turnOff': '关闭精简',
  'level': '精简档位',
  'notes': '说明',
  'noteOutput': '本机实测省 88% 输出 token（full 档），仅省输出、不省输入和推理，短回答可能反而更贵。',
  'noteTrigger': '也可在对话里说「少说废话」「精简」「/caveman」触发 skill；本开关是全局总开关。',
  'noteMeasured': '档位：lite 轻 / full 默认 / ultra 极致 / wenyan-full 文言。',
} as const

export const en = {
  'nav': 'Terse Output',
  'title': 'Caveman Terse Output',
  'description': 'Make the agent say less and save output tokens. The toggle applies to the next request.',
  'enabled': 'Status',
  'on': 'On',
  'off': 'Off',
  'turnOn': 'Enable',
  'turnOff': 'Disable',
  'level': 'Level',
  'notes': 'Notes',
  'noteOutput': 'Measured 88% output-token saving at full level; only output is saved, input and reasoning are not, and short answers may cost more.',
  'noteTrigger': 'You can also trigger the skill in-chat by saying "be brief" or "/caveman"; this toggle is the global switch.',
  'noteMeasured': 'Levels: lite / full (default) / ultra / wenyan-full.',
} as const

export type CavemanPanelKey = keyof typeof zh

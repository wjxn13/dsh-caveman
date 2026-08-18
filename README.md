# dsh-caveman

让 DeepSeek Harness 里的 AI **少说废话**：像聪明的穴居人一样极简输出，技术信息完整保留。

> **本机实测（DeepSeek V4-Flash，8 任务 × 5 档，2026-08-17）**：
>
> | 档位 | 平均输出 token | 节省 |
> |---|---|---|
> | baseline（正常） | 910 | — |
> | lite | 282 | 69% |
> | full（默认） | 112 | 88% |
> | ultra | 76 | 92% |
> | wenyan-full | 114 | 88% |
>
> 注：这是**输出 token** 的节省，输入和推理 token 不省；且 skill 本身每轮额外占约 1-1.5k 输入 token，**短回答可能反而更贵**。真正省 token 的大头在 [dsh-headroom](https://github.com/wjxn13/dsh-headroom) 的缓存命中（99.9%），输出精简是锦上添花。基准脚本 `benchmark/benchmark_output_tokens.py` 可复现。

> **「穴居人」是什么？** 源自英文梗 `why use many word when few word do trick`（能少说为什么多说）。穴居人（caveman）在西方文化里是「语言能力有限、只会蹦最核心词汇」的刻板印象。中文里更直观的类比是**电报体**「母病速归」或**文言文**「言简意赅」——删掉所有客套、修饰、语气词，只留信息最核心的词。技术信息一个字不少，废话一个不留。

> 本插件是 [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman)（MIT）的 **DeepSeek Harness 移植**，只移植 **skill 层（输出精简）**，不含输入代理（proxy）与浏览压缩。压缩规则源自 caveman，版权归原作者；本插件仅做 dsh 适配与中文强化。

## 为什么只做 skill 层

caveman 有三层：skill（输出精简）、proxy（输入压缩）、browse（浏览压缩）。本插件**只做 skill 层**，原因：

- **输出精简是 dsh 生态空白**——dsh 自带机制（稳定前缀缓存 + 工具结果瘦身 + 上下文压缩）和 [dsh-headroom](https://github.com/wjxn13/dsh-headroom)（Headroom 请求层输入压缩）全是**输入侧**，没人碰输出侧。
- **输入 proxy 不碰**——caveman 的输入 proxy 是有损压缩，会破坏 dsh-headroom 辛苦保住的 99.9% 前缀缓存，两个代理在请求链路上打架。输入侧交给 dsh-headroom，本插件只管输出侧，两者互补不冲突。

## 用法：命令触发

本插件通过**命令**控制输出精简（host 端命令 + 状态文件持久化，注入 system prompt）：

| 命令 | 作用 |
|---|---|
| `/caveman on` | 开启精简（默认 full 档）|
| `/caveman off` | 关闭精简 |
| `/caveman level <lite\|full\|ultra\|wenyan-full>` | 切档位（自动开启）|
| `/caveman status` | 查当前状态 |

开启后，精简规则注入每次请求的 system prompt，**跨会话一直生效**（状态存 `~/.dsh-caveman/state.json`，重启保持）。也可在对话里说「少说废话」「精简」「说重点」触发 skill 层（单会话生效，换会话需重触发）。

## 档位

| 档位 | 效果 |
|---|---|
| lite | 删填充/hedging，保留完整句子 |
| full（默认） | 短句碎片、短同义词，不叙述工具调用 |
| ultra | 一词够就不两词，每事实只述一次 |
| wenyan-full | 中文文言：字面省 80-90%（字符不是 token），高密度信息 |

示例（"为什么 React 组件重复渲染？"）：
- full："每次渲染新对象引用。内联对象 prop = 新引用 = 重渲染。useMemo 包之。"
- wenyan-full："每绘新生对象参照，故重绘；以 useMemo 包之则免。"

## 规则精髓

- **只删废话，不删技术**：填充词/客套/hedging 死，代码/命令/错误/commit 关键字原文保留。
- **红线**：绝不删否定词（不/没/只/仅/除），数字单位精确——翻转语义比省 token 糟。
- **不自指**：不说"精简模式开启"，只输出精简结果。
- **自动恢复**：安全警告、不可逆操作、多步歧义时自动退回完整表达。

## 与 dsh-headroom 配合（输入 + 输出一起省）

[dsh-headroom](https://github.com/wjxn13/dsh-headroom) 管**输入侧**（请求层压缩，保缓存），本插件管**输出侧**（精简废话）。两者正交、互补、不冲突，一起装效果叠加：

| | dsh-headroom | dsh-caveman |
|---|---|---|
| 省哪侧 | 输入 token（工具 schema + 跨轮去重） | 输出 token（删废话） |
| 机制 | Headroom 代理，无损保缓存 | 提示词规则，有损删修饰 |
| 省钱大头 | 99.9% 缓存命中（折扣价） | 88% 输出精简（本机实测） |

一个管**进**（把发给模型的输入压到最省，还不破坏缓存），一个管**出**（把模型吐出来的输出压到最省）。两个都装，token 消耗逼近理论下限。

## 设置页开关为何移除（攻坚留档）

本插件最初想做「设置页可点击开关」，但在 dsh 当前版本下第三方插件**无法在设置页放自己的开关**，三条路全被堵：

1. **settingsScope 注册自定义 namespace** → dsh API 网关 `dsh-host-apiproxy` 的 `exposedNamespaces()` 有硬编码白名单（模型提供者 + `WEB_SETTINGS_NAMESPACES` + `PRODUCT_SETTINGS_NAMESPACES`），插件自定义 namespace 被 `.filter(exposed.has(ns))` 过滤，返回 `settings-not-exposed`。源码注释明说「让插件自己声明暴露」是 **deferred work**（未实现）。
2. **remote.commands.execute 触发命令** → 该方法是 **agent 作用域**（`scope: { context: "agent" }`），设置页无活跃会话，agent identity 解析失败，调用失败。
3. 附带发现：dsh-headroom 源码里 `remote.command`（单数）是 bug，正确是 `remote.commands`（复数）；且 execute 只接受 `line` 一个参数（agent 自动解析），返回值读 `raw.value.result` 而非 `raw.result`。

**攻坚方向**（以后要做设置页开关时）：用 typert 的 `@Remote("name")` 装饰器 + `TypertRemoteService` 基类，定义一个**方法签名不含 agent 参数**的 non-scoped remote 方法（如 `setEnabled(enabled)`），client 端经 `ctx.get('remote').<namespace>.<method>()` 调用，绕过 agent scope。dsh-goal 的 `GoalService` 是可参考的 remote 服务范例。

## 安装

```bash
dsh plugin --profile web add "github:wjxn13/dsh-caveman"
```

装完重启 profile，对话里说「少说废话」/`/caveman` 触发 skill，或用 `/caveman on|off|level|status` 命令控制全局开关。

## 测试

```bash
npm install
node scripts/build.mjs    # 构建 host，验证源码可编译
```

真实功能验证：装进隔离测试实例，发消息说「少说废话」或执行 `/caveman status`，确认命令注册、状态文件 `~/.dsh-caveman/state.json` 写入、输出变精简。

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""caveman 输出 token 节省基准测试

对比 baseline（正常）vs caveman 各档位（lite/full/ultra/wenyan-full）
在同一批任务上的输出 token（completion_tokens，已关闭 thinking）。

用法：
    export DEEPSEEK_API_KEY=sk-xxx
    python benchmark_output_tokens.py
"""

import json
import os
import sys
import time
import urllib.request

API_URL = "https://api.deepseek.com/chat/completions"
MODEL = "deepseek-v4-flash"

# 各档位系统提示词（与 SKILL.md 规则一致）
SYSTEMS = {
    "baseline": "你是一个专业的编程助手。",
    "lite": "回答要专业紧凑：删掉填充词和不确定表述（其实、大概、可能），保留完整句子结构，直接给结论。",
    "full": "像聪明的穴居人一样极简回答：短句、碎片句 OK，用短同义词。删掉客套（好的、没问题）、填充词（其实、就是说）、不确定表述（可能、大概）。不铺垫，直接给结论和代码。技术术语、代码、命令原文保留，一个字不改。绝不删否定词（不/没/只/仅/除）。",
    "ultra": "极致精简：一词够就不两词，每事实只述一次，因果明确时删连词。不造缩写。直接给结论。技术术语、代码原文保留。绝不删否定词。",
    "wenyan-full": "用文言文回答，最大精简。文言句式，动宾前置，主语常省，用文言虚词（之/乃/为/其）。技术术语、代码原文保留。",
}

# 测试题（技术 + 中文概念，覆盖 caveman 官方基准场景）
TASKS = [
    "解释 React 组件为什么会重复渲染，以及怎么用 useMemo 修复",
    "修复这个 bug：auth 中间件的 token 过期判断用了 < 而不是 <=，导致边界情况 token 提前过期，说明问题和修法",
    "说明 PostgreSQL 连接池是什么，以及为什么需要它",
    "实现一个 React error boundary 组件，并解释它的作用",
    "用中文解释什么是梯度下降",
    "写一个 Python 函数判断一个数是不是素数，并简单说明思路",
    "解释 HTTP 和 HTTPS 的区别",
    "说明什么是数据库事务，以及 ACID 分别是什么",
]


def load_api_key():
    key = os.environ.get("DEEPSEEK_API_KEY")
    if key:
        return key
    cred = os.path.expanduser("~/.dsh/.credentials.yaml")
    if os.path.exists(cred):
        for line in open(cred, encoding="utf-8"):
            if line.startswith("DEEPSEEK_API_KEY:"):
                return line.split(":", 1)[1].strip()
    return None


def call_api(system, user, api_key):
    payload = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
        "thinking": {"type": "disabled"},
    }
    req = urllib.request.Request(
        API_URL,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": "Bearer " + api_key,
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=60) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    content = data["choices"][0]["message"]["content"]
    tokens = data["usage"]["completion_tokens"]
    return content, tokens


def avg(lst):
    vals = [x for x in lst if x is not None]
    return sum(vals) / len(vals) if vals else 0


def main():
    api_key = load_api_key()
    if not api_key:
        print("缺少 DEEPSEEK_API_KEY")
        return 1

    results = {level: [] for level in SYSTEMS}
    samples = {}

    total = len(SYSTEMS) * len(TASKS)
    done = 0
    for level, system in SYSTEMS.items():
        for task in TASKS:
            done += 1
            try:
                content, tokens = call_api(system, task, api_key)
                results[level].append(tokens)
                if task in (TASKS[0], TASKS[5]):
                    samples.setdefault(level, {})[task] = content
                print(f"[{done}/{total}] {level:<12} {tokens:>5} tok  {task[:24]}", flush=True)
            except Exception as e:
                results[level].append(None)
                print(f"[{done}/{total}] {level:<12} 失败   {task[:24]}  ({e})", flush=True)
            time.sleep(0.4)

    base_avg = avg(results["baseline"])
    print("\n" + "=" * 46)
    print(f"{'档位':<14}{'平均输出 token':<16}{'节省 %':<10}")
    print("-" * 46)
    for level in SYSTEMS:
        a = avg(results[level])
        save = (base_avg - a) / base_avg * 100 if base_avg else 0
        print(f"{level:<14}{a:<16.1f}{save:>6.1f}%")

    print("\n样例对比（题1：React 重渲染）")
    for level in ["baseline", "full", "ultra", "wenyan-full"]:
        s = samples.get(level, {}).get(TASKS[0], "")
        print(f"\n[{level}] {len(s)} 字符:\n{s[:220]}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

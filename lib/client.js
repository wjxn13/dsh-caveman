window.__ModuleLoader__.load({ id: "dsh-caveman", factory: (require) => {
  var module = { exports: {} };
  var exports = module.exports;
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client/index.ts
var index_exports = {};
__export(index_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(index_exports);

// src/client/CavemanPanel.tsx
var import_react = require("react");

// src/constants.ts
var LEVELS = {
  lite: "\u56DE\u7B54\u8981\u4E13\u4E1A\u7D27\u51D1\uFF1A\u5220\u6389\u586B\u5145\u8BCD\u548C\u4E0D\u786E\u5B9A\u8868\u8FF0\uFF08\u5176\u5B9E\u3001\u5927\u6982\u3001\u53EF\u80FD\uFF09\uFF0C\u4FDD\u7559\u5B8C\u6574\u53E5\u5B50\u7ED3\u6784\uFF0C\u76F4\u63A5\u7ED9\u7ED3\u8BBA\u3002",
  full: "\u50CF\u806A\u660E\u7684\u7A74\u5C45\u4EBA\u4E00\u6837\u6781\u7B80\u56DE\u7B54\uFF1A\u77ED\u53E5\u3001\u788E\u7247\u53E5 OK\uFF0C\u7528\u77ED\u540C\u4E49\u8BCD\u3002\u5220\u6389\u5BA2\u5957\uFF08\u597D\u7684\u3001\u6CA1\u95EE\u9898\uFF09\u3001\u586B\u5145\u8BCD\uFF08\u5176\u5B9E\u3001\u5C31\u662F\u8BF4\uFF09\u3001\u4E0D\u786E\u5B9A\u8868\u8FF0\uFF08\u53EF\u80FD\u3001\u5927\u6982\uFF09\u3002\u4E0D\u94FA\u57AB\uFF0C\u76F4\u63A5\u7ED9\u7ED3\u8BBA\u548C\u4EE3\u7801\u3002\u6280\u672F\u672F\u8BED\u3001\u4EE3\u7801\u3001\u547D\u4EE4\u3001\u9519\u8BEF\u539F\u6587\u4FDD\u7559\uFF0C\u4E00\u4E2A\u5B57\u4E0D\u6539\u3002\u7EDD\u4E0D\u5220\u5426\u5B9A\u8BCD\uFF08\u4E0D/\u6CA1/\u53EA/\u4EC5/\u9664\uFF09\u3002",
  ultra: "\u6781\u81F4\u7CBE\u7B80\uFF1A\u4E00\u8BCD\u591F\u5C31\u4E0D\u4E24\u8BCD\uFF0C\u6BCF\u4E8B\u5B9E\u53EA\u8FF0\u4E00\u6B21\uFF0C\u56E0\u679C\u660E\u786E\u65F6\u5220\u8FDE\u8BCD\u3002\u4E0D\u9020\u7F29\u5199\u3002\u76F4\u63A5\u7ED9\u7ED3\u8BBA\u3002\u6280\u672F\u672F\u8BED\u3001\u4EE3\u7801\u539F\u6587\u4FDD\u7559\u3002\u7EDD\u4E0D\u5220\u5426\u5B9A\u8BCD\u3002",
  "wenyan-full": "\u7528\u6587\u8A00\u6587\u56DE\u7B54\uFF0C\u6700\u5927\u7CBE\u7B80\u3002\u6587\u8A00\u53E5\u5F0F\uFF0C\u52A8\u5BBE\u524D\u7F6E\uFF0C\u4E3B\u8BED\u5E38\u7701\uFF0C\u7528\u6587\u8A00\u865A\u8BCD\uFF08\u4E4B/\u4E43/\u4E3A/\u5176\uFF09\u3002\u6280\u672F\u672F\u8BED\u3001\u4EE3\u7801\u539F\u6587\u4FDD\u7559\u3002"
};

// src/client/CavemanPanel.module.css
var css = ".section_wl13vp {\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n}\n\n.card_1tafk {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  padding: 16px;\n  border: 1px solid var(--dsw-color-border, rgba(0, 0, 0, 0.1));\n  border-radius: 8px;\n}\n\n.row_2fa2 {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 12px;\n}\n\n.label_1p5sz8 {\n  font-size: 13px;\n  color: var(--dsw-color-text-secondary, rgba(0, 0, 0, 0.6));\n}\n\n.value_1unypd {\n  font-size: 13px;\n  font-weight: 500;\n}\n\n.actions_1ftekn1 {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px;\n}\n\n.notes_1qipc1 {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n  font-size: 12px;\n  color: var(--dsw-color-text-secondary, rgba(0, 0, 0, 0.6));\n  line-height: 1.5;\n}\n\n.notesTitle_1xoosuv {\n  font-weight: 500;\n  color: var(--dsw-color-text, rgba(0, 0, 0, 0.85));\n}\n\n.warning_ilgs64 {\n  font-size: 12px;\n  color: var(--dsw-color-danger, #d32f2f);\n  line-height: 1.5;\n}\n";
var tagId = "dsh-caveman/CavemanPanel.module.css";
if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
  const tag = document.createElement("style");
  tag.dataset.plugin = "dsh-caveman";
  tag.dataset.pluginCss = tagId;
  tag.textContent = css;
  document.head.appendChild(tag);
}
var CavemanPanel_default = { "section": "section_wl13vp", "card": "card_1tafk", "row": "row_2fa2", "label": "label_1p5sz8", "value": "value_1unypd", "actions": "actions_1ftekn1", "notes": "notes_1qipc1", "notesTitle": "notesTitle_1xoosuv", "warning": "warning_ilgs64" };

// src/client/CavemanPanel.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var LEVEL_KEYS = Object.keys(LEVELS);
function levelLabel(level) {
  return level === "wenyan-full" ? "wenyan" : level;
}
function parseStatus(text) {
  const on = text.match(/开启（档位\s*(\S+)）/);
  if (on) return { enabled: true, level: on[1] };
  return { enabled: false, level: "full" };
}
function cmd(name, arg) {
  return arg !== void 0 ? `/${name} ${arg}` : `/${name}`;
}
function CavemanPanel(props) {
  const { runCommand, t } = props;
  const [enabled, setEnabled] = (0, import_react.useState)(false);
  const [level, setLevel] = (0, import_react.useState)("full");
  const [busy, setBusy] = (0, import_react.useState)(false);
  const [error, setError] = (0, import_react.useState)(null);
  (0, import_react.useEffect)(() => {
    if (runCommand === void 0) return;
    let alive = true;
    void (async () => {
      const result = await runCommand(cmd("caveman-status"));
      if (!alive) return;
      const state = parseStatus(result.text);
      setEnabled(state.enabled);
      setLevel(state.level);
    })();
    return () => {
      alive = false;
    };
  }, [runCommand]);
  if (runCommand === void 0 || t === void 0) return null;
  const act = async (line, after) => {
    setBusy(true);
    setError(null);
    const result = await runCommand(line);
    if (result.kind === "error") setError(result.text);
    else after();
    setBusy(false);
  };
  const refresh = async () => {
    const result = await runCommand(cmd("caveman", "status"));
    const state = parseStatus(result.text);
    setEnabled(state.enabled);
    setLevel(state.level);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: CavemanPanel_default["section"], "aria-label": t("title"), children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: CavemanPanel_default["card"], children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: CavemanPanel_default["row"], children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: CavemanPanel_default["label"], children: t("enabled") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: CavemanPanel_default["value"], children: enabled ? t("on") : t("off") })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: CavemanPanel_default["actions"], children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "button",
          {
            type: "button",
            className: "dsw-button dsw-button--primary",
            disabled: busy || enabled,
            onClick: () => {
              void act(cmd("caveman-on"), () => setEnabled(true));
            },
            children: t("turnOn")
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "button",
          {
            type: "button",
            className: "dsw-button",
            disabled: busy || !enabled,
            onClick: () => {
              void act(cmd("caveman-off"), () => setEnabled(false));
            },
            children: t("turnOff")
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: CavemanPanel_default["card"], children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: CavemanPanel_default["row"], children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: CavemanPanel_default["label"], children: t("level") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: CavemanPanel_default["value"], children: levelLabel(level) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: CavemanPanel_default["actions"], children: LEVEL_KEYS.map((key) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "button",
        {
          type: "button",
          className: key === level ? "dsw-button dsw-button--primary" : "dsw-button",
          disabled: busy,
          onClick: () => {
            void act(cmd("caveman-level", key), () => {
              setLevel(key);
              setEnabled(true);
            });
          },
          children: levelLabel(key)
        },
        key
      )) })
    ] }),
    error !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: CavemanPanel_default["warning"], children: error }) : null,
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: CavemanPanel_default["notes"], children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: CavemanPanel_default["notesTitle"], children: t("notes") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
        "\u2022 ",
        t("noteOutput")
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
        "\u2022 ",
        t("noteTrigger")
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
        "\u2022 ",
        t("noteMeasured")
      ] })
    ] })
  ] });
}

// src/client/locales.ts
var zh = {
  "nav": "\u8F93\u51FA\u7CBE\u7B80",
  "title": "Caveman \u8F93\u51FA\u7CBE\u7B80",
  "description": "\u8BA9 AI \u5C11\u8BF4\u5E9F\u8BDD\uFF0C\u8282\u7701\u8F93\u51FA token\u3002\u5F00\u5173\u70ED\u751F\u6548\uFF0C\u4E0B\u4E00\u6B21\u8BF7\u6C42\u5373\u5E94\u7528\u3002",
  "enabled": "\u5F53\u524D\u72B6\u6001",
  "on": "\u5DF2\u5F00\u542F",
  "off": "\u5DF2\u5173\u95ED",
  "turnOn": "\u5F00\u542F\u7CBE\u7B80",
  "turnOff": "\u5173\u95ED\u7CBE\u7B80",
  "level": "\u7CBE\u7B80\u6863\u4F4D",
  "error": "\u9519\u8BEF\uFF1A{message}",
  "notes": "\u8BF4\u660E",
  "noteOutput": "\u672C\u673A\u5B9E\u6D4B\u7701 88% \u8F93\u51FA token\uFF08full \u6863\uFF09\uFF0C\u4EC5\u7701\u8F93\u51FA\u3001\u4E0D\u7701\u8F93\u5165\u548C\u63A8\u7406\uFF0C\u77ED\u56DE\u7B54\u53EF\u80FD\u53CD\u800C\u66F4\u8D35\u3002",
  "noteTrigger": "\u4E5F\u53EF\u5728\u5BF9\u8BDD\u91CC\u8BF4\u300C\u5C11\u8BF4\u5E9F\u8BDD\u300D\u300C\u7CBE\u7B80\u300D\u300C/caveman\u300D\u89E6\u53D1 skill\uFF1B\u672C\u5F00\u5173\u662F\u5168\u5C40\u603B\u5F00\u5173\u3002",
  "noteMeasured": "\u6863\u4F4D\uFF1Alite \u8F7B / full \u9ED8\u8BA4 / ultra \u6781\u81F4 / wenyan-full \u6587\u8A00\u3002"
};
var en = {
  "nav": "Terse Output",
  "title": "Caveman Terse Output",
  "description": "Make the agent say less and save output tokens. The toggle applies to the next request.",
  "enabled": "Status",
  "on": "On",
  "off": "Off",
  "turnOn": "Enable",
  "turnOff": "Disable",
  "level": "Level",
  "error": "Error: {message}",
  "notes": "Notes",
  "noteOutput": "Measured 88% output-token saving at full level; only output is saved, input and reasoning are not, and short answers may cost more.",
  "noteTrigger": 'You can also trigger the skill in-chat by saying "be brief" or "/caveman"; this toggle is the global switch.',
  "noteMeasured": "Levels: lite / full (default) / ultra / wenyan-full."
};

// src/client/index.ts
var NS = "dsh-caveman";
var inject = ["slots", "locale", "connection", "remote", "sessions"];
function apply(ctx) {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), "dsh-caveman: copy dictionaries");
  const t = ctx.locale.bind(NS);
  const remote = ctx.get("remote");
  const runCommand = async (line) => {
    if (remote?.commands?.execute === void 0) {
      return { kind: "error", text: t("error").replace("{message}", "host command channel unavailable") };
    }
    try {
      const raw = await remote.commands.execute(line);
      const value = raw?.value;
      const result = value?.result;
      if (result?.kind === "error") {
        return { kind: "error", text: result.text ?? "unknown command error" };
      }
      if (result?.kind === "success") {
        return { kind: "success", text: result.text ?? "" };
      }
      return { kind: "error", text: String(raw) };
    } catch (failure) {
      return { kind: "error", text: failure instanceof Error ? failure.message : String(failure) };
    }
  };
  const injected = () => ({ runCommand, t });
  ctx.slots.inject("settings.section", () => ctx.slots.register({
    name: "settings.section",
    id: "dsh-caveman",
    order: 30,
    label: () => t("nav"),
    inject: injected
  }, CavemanPanel));
}
return module.exports; } });
//# sourceMappingURL=client.js.map

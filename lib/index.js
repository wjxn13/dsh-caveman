// src/index.ts
import z from "@deepseek-ai/schemastery";

// src/constants.ts
var PLUGIN_NAME = "dsh-caveman";
var SECTION_ORDER = 50;
var LEVELS = {
  lite: "\u56DE\u7B54\u8981\u4E13\u4E1A\u7D27\u51D1\uFF1A\u5220\u6389\u586B\u5145\u8BCD\u548C\u4E0D\u786E\u5B9A\u8868\u8FF0\uFF08\u5176\u5B9E\u3001\u5927\u6982\u3001\u53EF\u80FD\uFF09\uFF0C\u4FDD\u7559\u5B8C\u6574\u53E5\u5B50\u7ED3\u6784\uFF0C\u76F4\u63A5\u7ED9\u7ED3\u8BBA\u3002",
  full: "\u50CF\u806A\u660E\u7684\u7A74\u5C45\u4EBA\u4E00\u6837\u6781\u7B80\u56DE\u7B54\uFF1A\u77ED\u53E5\u3001\u788E\u7247\u53E5 OK\uFF0C\u7528\u77ED\u540C\u4E49\u8BCD\u3002\u5220\u6389\u5BA2\u5957\uFF08\u597D\u7684\u3001\u6CA1\u95EE\u9898\uFF09\u3001\u586B\u5145\u8BCD\uFF08\u5176\u5B9E\u3001\u5C31\u662F\u8BF4\uFF09\u3001\u4E0D\u786E\u5B9A\u8868\u8FF0\uFF08\u53EF\u80FD\u3001\u5927\u6982\uFF09\u3002\u4E0D\u94FA\u57AB\uFF0C\u76F4\u63A5\u7ED9\u7ED3\u8BBA\u548C\u4EE3\u7801\u3002\u6280\u672F\u672F\u8BED\u3001\u4EE3\u7801\u3001\u547D\u4EE4\u3001\u9519\u8BEF\u539F\u6587\u4FDD\u7559\uFF0C\u4E00\u4E2A\u5B57\u4E0D\u6539\u3002\u7EDD\u4E0D\u5220\u5426\u5B9A\u8BCD\uFF08\u4E0D/\u6CA1/\u53EA/\u4EC5/\u9664\uFF09\u3002",
  ultra: "\u6781\u81F4\u7CBE\u7B80\uFF1A\u4E00\u8BCD\u591F\u5C31\u4E0D\u4E24\u8BCD\uFF0C\u6BCF\u4E8B\u5B9E\u53EA\u8FF0\u4E00\u6B21\uFF0C\u56E0\u679C\u660E\u786E\u65F6\u5220\u8FDE\u8BCD\u3002\u4E0D\u9020\u7F29\u5199\u3002\u76F4\u63A5\u7ED9\u7ED3\u8BBA\u3002\u6280\u672F\u672F\u8BED\u3001\u4EE3\u7801\u539F\u6587\u4FDD\u7559\u3002\u7EDD\u4E0D\u5220\u5426\u5B9A\u8BCD\u3002",
  "wenyan-full": "\u7528\u6587\u8A00\u6587\u56DE\u7B54\uFF0C\u6700\u5927\u7CBE\u7B80\u3002\u6587\u8A00\u53E5\u5F0F\uFF0C\u52A8\u5BBE\u524D\u7F6E\uFF0C\u4E3B\u8BED\u5E38\u7701\uFF0C\u7528\u6587\u8A00\u865A\u8BCD\uFF08\u4E4B/\u4E43/\u4E3A/\u5176\uFF09\u3002\u6280\u672F\u672F\u8BED\u3001\u4EE3\u7801\u539F\u6587\u4FDD\u7559\u3002"
};
var DEFAULT_LEVEL = "full";

// src/index.ts
var name = PLUGIN_NAME;
var inject = ["systemPrompt", "commands"];
var Config = z.object({
  enabled: z.boolean().default(false),
  level: z.union(["lite", "full", "ultra", "wenyan-full"]).default(DEFAULT_LEVEL)
});
function apply(ctx) {
  ctx.logger?.info("[dsh-caveman] apply() entered");
  let scope;
  let state = { enabled: false, level: DEFAULT_LEVEL };
  ctx.inject(["settings"], (settingsCtx) => {
    ctx.logger?.info("[dsh-caveman] ctx.inject settings callback fired");
    scope = settingsCtx.settings.register("dsh-caveman", Config);
    state = scope.get();
    ctx.logger?.info("[dsh-caveman] namespace registered, state=" + JSON.stringify(state));
    scope.watch((next) => {
      state = next;
    });
  });
  ctx.effect(function* () {
    ctx.logger?.info("[dsh-caveman] effect: registering section + commands");
    yield ctx.systemPrompt.section({
      name: "caveman",
      order: SECTION_ORDER,
      text: () => state.enabled ? LEVELS[state.level] : ""
    });
    yield ctx.commands.register({
      name: "caveman-on",
      description: "\u5F00\u542F\u8F93\u51FA\u7CBE\u7B80\uFF08caveman \u6A21\u5F0F\uFF09",
      handler: async () => {
        await scope?.update({ enabled: true });
        return { kind: "success", text: `\u8F93\u51FA\u7CBE\u7B80\u5DF2\u5F00\u542F\uFF08\u6863\u4F4D ${state.level}\uFF09` };
      }
    });
    yield ctx.commands.register({
      name: "caveman-off",
      description: "\u5173\u95ED\u8F93\u51FA\u7CBE\u7B80",
      handler: async () => {
        await scope?.update({ enabled: false });
        return { kind: "success", text: "\u8F93\u51FA\u7CBE\u7B80\u5DF2\u5173\u95ED" };
      }
    });
    yield ctx.commands.register({
      name: "caveman-level",
      description: "\u5207\u6362\u6863\u4F4D\uFF1Alite / full / ultra / wenyan-full",
      handler: async (invocation) => {
        const raw = invocation.rawInput.trim().toLowerCase();
        if (!Object.hasOwn(LEVELS, raw)) {
          return { kind: "error", text: `\u672A\u77E5\u6863\u4F4D\u300C${raw}\u300D\uFF0C\u53EF\u9009\uFF1A${Object.keys(LEVELS).join(" / ")}` };
        }
        await scope?.update({ level: raw, enabled: true });
        return { kind: "success", text: `\u6863\u4F4D\u5DF2\u5207\u5230 ${raw}` };
      }
    });
    yield ctx.commands.register({
      name: "caveman-status",
      description: "\u67E5\u770B\u8F93\u51FA\u7CBE\u7B80\u72B6\u6001",
      handler: async () => {
        const cur = scope !== void 0 ? scope.get() : state;
        return {
          kind: "success",
          text: cur.enabled ? `\u8F93\u51FA\u7CBE\u7B80\uFF1A\u5F00\u542F\uFF08\u6863\u4F4D ${cur.level}\uFF09` : "\u8F93\u51FA\u7CBE\u7B80\uFF1A\u5173\u95ED"
        };
      }
    });
  }, "dsh-caveman lifecycle");
}
export {
  apply,
  inject,
  name
};
//# sourceMappingURL=index.js.map

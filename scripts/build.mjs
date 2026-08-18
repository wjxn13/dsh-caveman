/**
 * Standalone build for the dsh-caveman plugin.
 *
 * Produces:
 *  - lib/index.js   (host half, ESM, bundled with esbuild)
 *  - lib/client.js  (browser half, CJS closure for the dsh client loader)
 *
 * The plugin is self-contained: it does not depend on the DeepSeek Harness
 * source tree. Only esbuild is required at build time.
 */
import { build } from 'esbuild'
import { existsSync, mkdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')
const pkgName = 'dsh-caveman'

mkdirSync(join(root, 'lib'), { recursive: true })

const host = process.argv.includes('--host')
const client = process.argv.includes('--client')

/** esbuild plugin that inlines CSS Modules the way the dsh client loader expects. */
function inlineCssModules(pluginId) {
  return {
    name: 'dsh-css-modules-inline',
    setup(build) {
      build.onLoad({ filter: /\.module\.css$/ }, (args) => {
        const css = readFileSync(args.path, 'utf8')
        const hash = (s) => {
          let h = 0
          for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
          return (h >>> 0).toString(36)
        }
        const classMap = {}
        const renamed = css.replace(/\.([_a-zA-Z][\w-]*)/g, (match, name) => {
          const mapped = `${name.replace(/^_/, '')}_${hash(name)}`
          classMap[name] = mapped
          return `.${mapped}`
        })
        const cssText = JSON.stringify(renamed)
        const tagId = JSON.stringify(`${pluginId}/${args.path.split(/[\\/]/).pop()}`)
        return {
          contents: [
            `const css = ${cssText};`,
            `const tagId = ${tagId};`,
            "if (typeof document !== 'undefined' && document.querySelector('style[data-plugin-css=' + JSON.stringify(tagId) + ']') === null) {",
            "  const tag = document.createElement('style');",
            `  tag.dataset.plugin = ${JSON.stringify(pluginId)};`,
            '  tag.dataset.pluginCss = tagId;',
            '  tag.textContent = css;',
            '  document.head.appendChild(tag);',
            '}',
            `export default ${JSON.stringify(classMap)};`,
          ].join('\n'),
          loader: 'js',
        }
      })
    },
  }
}

const cssPlugin = inlineCssModules(pkgName)

async function buildHost() {
  await build({
    entryPoints: [join(root, 'src/index.ts')],
    outfile: join(root, 'lib/index.js'),
    bundle: true,
    platform: 'node',
    format: 'esm',
    target: 'es2022',
    external: ['@deepseek-ai/*'],
    sourcemap: true,
  })
  console.log('[dsh-caveman] host built -> lib/index.js')
}

async function buildClient() {
  await build({
    entryPoints: [join(root, 'src/client/index.ts')],
    outfile: join(root, 'lib/client.js'),
    bundle: true,
    platform: 'browser',
    format: 'cjs',
    target: 'es2022',
    external: [
      'react',
      'react/jsx-runtime',
      'react-dom',
      'react-dom/client',
      '@deepseek-ai/cordis',
      '@deepseek-ai/dsh-client-ui-slots',
      '@deepseek-ai/dsh-client-web-react',
      '@deepseek-ai/dsh-client-ui-primitives',
      '@deepseek-ai/dsh-client-ui-attachment',
      '@deepseek-ai/dsh-client-schema-form',
      '@deepseek-ai/dsh-client-runtime/client',
    ],
    sourcemap: true,
    banner: {
      js: `window.__ModuleLoader__.load({ id: ${JSON.stringify(pkgName)}, factory: (require) => {
  var module = { exports: {} };
  var exports = module.exports;`,
    },
    footer: {
      js: 'return module.exports; } });',
    },
    outExtension: { '.js': '.js' },
    plugins: [cssPlugin],
    loader: { '.css': 'empty' },
    define: {
      'process.env.NODE_ENV': JSON.stringify('production'),
      'import.meta.env.MODE': JSON.stringify('production'),
      'import.meta.env': JSON.stringify({ MODE: 'production' }),
    },
  })
  console.log('[dsh-caveman] client built -> lib/client.js')
}

if (!host && !client) {
  await Promise.all([buildHost(), buildClient()])
} else {
  if (host) await buildHost()
  if (client) await buildClient()
}
console.log('[dsh-caveman] done.')

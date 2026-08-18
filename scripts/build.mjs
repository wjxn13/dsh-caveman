/**
 * Standalone build for the dsh-caveman plugin (host half only).
 *
 * Produces lib/index.js (host half, ESM, bundled with esbuild).
 * The browser settings page was removed (see the "settings-page" branch note in
 * README): dsh's API gateway does not yet expose plugin-owned settings
 * namespaces nor a non-agent-scoped command channel to the browser, so the
 * toggle is driven by chat commands (/caveman on/off/level/status) instead.
 */
import { build } from 'esbuild'
import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')

mkdirSync(join(root, 'lib'), { recursive: true })

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

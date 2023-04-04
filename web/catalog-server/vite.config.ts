import { defineConfig, UserConfigExport, ConfigEnv, loadEnv } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import viteCompression from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv): UserConfigExport => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }
  console.log(process.env)
  return defineConfig({
    plugins: [
      vue(),
      viteCompression({ deleteOriginFile: true }),
      {
        name: 'configure-response-headers',
        configureServer: (server) => {
          server.middlewares.use((_req, res, next) => {
            res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp')
            res.setHeader('Cross-Origin-Opener-Policy', 'same-origin')
            next()
          })
        },
      },
    ],
    resolve: {
      alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
    },
    build: {
      outDir: '../dist',
      assetsDir: 'static',
      emptyOutDir: true,
      rollupOptions: {
        output: {
          sanitizeFileName: (name) => {
            // eslint-disable-next-line no-control-regex
            const INVALID_CHAR_REGEX = /[\x00-\x1F\x7F<>*#"{}|^[\]`;?:&=+$,]/g
            const DRIVE_LETTER_REGEX = /^[a-z]:/i
            const match = DRIVE_LETTER_REGEX.exec(name)
            const driveLetter = match ? match[0] : ''

            return (
              driveLetter +
              name.substr(driveLetter.length).replace(INVALID_CHAR_REGEX, '')
            )
          },
        },
      },
    },
    server: {
      host: '0.0.0.0',
      port: 9999,
      proxy: {
        // change xxx-api/login => mock/login
        // detail: https://cli.vuejs.org/config/#devserver-proxy
        [String(process.env.VITE_APP_BASE_API)]: {
          target: process.env.VITE_APP_PROXY_TARGET,
          changeOrigin: true,
          rewrite: (path) => {
            const reg = RegExp('^' + process.env.VITE_APP_BASE_API)
            return path.replace(reg, '')
          },
          ws: false,
        },
      },
      headers: {
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Cross-Origin-Opener-Policy': 'same-origin',
      },
    },
  })
}

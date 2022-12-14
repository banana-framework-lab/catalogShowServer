import { defineConfig, UserConfigExport, ConfigEnv, loadEnv } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import viteCompression from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv): UserConfigExport => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }
  console.log(process.env)
  return defineConfig({
    plugins: [vue(), viteCompression({ deleteOriginFile: true })],
    resolve: {
      alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
    },
    build: {
      outDir: '../dist',
      assetsDir: 'static',
      emptyOutDir: true,
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
    },
  })
}

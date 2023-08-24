import { defineConfig, loadEnv } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import ViteSvgIconsPlugin from 'vite-plugin-svg-icons'
import { injectHtml, minifyHtml } from 'vite-plugin-html'
import ViteRequireContext from '@originjs/vite-plugin-require-context'
import { viteCommonjs } from '@originjs/vite-plugin-commonjs'
import externalGlobals from 'rollup-plugin-external-globals'
import babel from 'vite-babel-plugin'
import replace from '@rollup/plugin-replace'
import path from 'path'

function resolve(dir) {
    return path.join(__dirname, './', dir)
}
// https://vitejs.dev/config/
export default ({ command, mode }) => {
    console.log(mode)
    const config = loadEnv(mode, './')
    return defineConfig({
        base: command === 'serve' ? '/' : '/pcenter/',
        plugins: [
            minifyHtml(),
            viteCommonjs({
                include: ['@/src', '@vue/babel-helper-vue-jsx-merge-props', 'dayjs'],
            }),
            injectHtml({
                data: {
                    title: 'Goboo平台管理中心',
                    isBuild: command === 'build',
                },
            }),
            createVuePlugin({
                jsx: true,
                jsxOptions: {
                    injectH: true,
                },
            }),
            ViteRequireContext(),
            babel(),
            ViteSvgIconsPlugin({
                iconDirs: [path.resolve(process.cwd(), 'src/icons/svg'), '@goboo/common/assets/icons'],
                symbolId: 'icon-[dir]-[name]',
            }),
        ],
        resolve: {
            alias: {
                '@': resolve('src'),
                '~@': resolve('src'),
            },
            extensions: ['.js', '.vue', '.json', '.scss', '*'],
        },
        css: {
            postcss: [require('autoprefixer')],
            preprocessorOptions: {
                scss: {
                    additionalData: `@import "@/styles/mixin.scss";`,
                    charset: false,
                },
            },
        },
        server: {
            host: '0.0.0.0',
            port: '9531',
            open: false,
            fs: {
                strict: false
            },
        },
        define: {
            'process.env.API_HOST': JSON.stringify(config.VITE_APP_BASE_API),
            'process.env.BASE_API': JSON.stringify(config.VITE_APP_BASE_API),
            'process.env.BASE_URL': JSON.stringify(config.VITE_APP_BASE_API),
            'process.env.MALL_WAP': JSON.stringify(config.VITE_APP_MALL_URL),
            'process.env.MALL_ES': JSON.stringify(config.VITE_APP_MALL_URL),
            'process.env.MALL_PCWAP': JSON.stringify(config.VITE_APP_MALL_URL),
            'process.env.MODE': JSON.stringify(mode),
        },
        esbuild: {
            jsxFactory: 'h',
            jsxFragment: 'Fragment',
            include: ['.vue', '.jsx', '.tsx', '.js'],
        },
        build: {
            watch: {
                exclude: 'node_modules/**',
                include: '@/src/**'
            },
            chunkSizeWarningLimit: 655,
            target: 'es2015',
            outDir: 'dist', // 指定输出路径（相对于 项目根目录).
            assetsDir: 'static', // 指定生成静态资源的存放路径（相对于 build.outDir）。
            assetsInlineLimit: 4096, // 小于此阈值的导入或引用资源将内联为 base64 编码，以避免额外的 http 请求。设置为 0 可以完全禁用此项。
            cssCodeSplit: true, // 启用/禁用 CSS 代码拆分。当启用时，在异步 chunk 中导入的 CSS 将内联到异步 chunk 本身，并在块加载时插入。
            sourcemap: false, // 构建后是否生成 source map 文件。
            rollupOptions: {
                external: ['vue', 'vuex', 'vue-router', 'element-ui'],
                plugins: [
                    externalGlobals({
                        vue: 'Vue',
                        vuex: 'Vuex',
                        'vue-router': 'VueRouter',
                        'element-ui': 'ELEMENT',
                    }),
                    replace({
                        'process.platform': JSON.stringify(process.platform),
                        'process.client': true,
                    }),
                ],
            },
        },
    })
}

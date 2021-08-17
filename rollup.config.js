import babel from '@rollup/plugin-babel';

export default {
    input: 'src/index.js',
    output: {
        name: 'CrossEndCanvas',
        /**
         * amd – 异步模块定义，用于像 RequireJS 这样的模块加载器
         * cjs – CommonJS，适用于 Node 和 Browserify/Webpack
         * es – 将软件包保存为 ES 模块文件
         * iife – 一个自动执行的功能，适合作为 <script> 标签
         * umd – 通用模块定义，以 amd，cjs 和 iife 为一体
         */
        format: 'iife',
        file: "./dist/cross-end-canvas.js",
    },
    plugins: [

        // 帮助 Rollup 查找外部模块，然后安装
        require('rollup-plugin-node-resolve')({
            customResolveOptions: {
                moduleDirectory: 'node_modules'
            }
        }),

        // 将CommonJS模块转换为 ES2015 供 Rollup 处理
        require('rollup-plugin-commonjs')({
            include: "node_modules/**",
            exclude: []
        }),

        // ES5+转义
        babel({
            /**
             * 'runtime' - 如果你要用rollup构建一个js包的时候，使用该配置，该配置要结合@babel/plugin-transform-runtime插件使用，使用@babel/plugin-transform-runtime也要安装@babel/runtime插件
             * 'bundled' - 如果用rollup构建一个项目的用此参数
             * 'inline' 官网不推荐使用，会导致很多重复性代码
             * 'external' 要结合@babel/plugin-external-helpers插件使用，它会把helpers 收集到一个共享模块，我的理解是相当于runtime和bundled一个集合，就是把helpers 抽到一个全局的共享模块但是又不会造成全局的污染
             */
            babelHelpers: "bundled",
            babelrc: false,
            // 未进行API兼容处理，是因为不想把项目变太大
            presets: ["@babel/preset-env"],
            include: ["node_modules/**", "src/**"],
            exclude: []
        })

    ]
};

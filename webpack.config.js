// `CheckerPlugin` is optional. Use it if you want async error reporting.
// We need this plugin to detect a `--watch` mode. It may be removed later
// after https://github.com/webpack/webpack/issues/3460 will be resolved.
const { CheckerPlugin } = require("awesome-typescript-loader");
var webpack = require("webpack");
var LiveReloadPlugin = require("webpack-livereload-plugin");

const nodeEnv = process.env.NODE_ENV || "development";
const isProd = nodeEnv == "production";
const baseUrl = process.env.BASE_URL || "http://localhost:4000/";
const parseUrl = process.env.PARSE_URL || baseUrl;

console.log("Webpack building extension.. ", { nodeEnv, isProd, baseUrl, parseUrl });

const config = {
    entry: {
        background: "./src/scripts/background/background.tsx",
        browseraction: "./src/scripts/browserAction/browserAction.tsx",
        installed: "./src/scripts/installed/installed.tsx",
        settingsPage: "./src/scripts/settingsPage/settingsPage.tsx",
        // "installed": ['./src/installed/main'],
        contentScript: ["./src/scripts/contentScript/contentScript.tsx"]
        //vendor: ["react", "react-dom", "parse", "@blueprintjs/core",]
    },
    output: {
        filename: "[name]-bundle.js",
        path: __dirname + "/dist"
    },

    mode: isProd ? "production" : "development",

    // Enable sourcemaps for debugging webpack's output.
    devtool: isProd ? undefined : "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json"]
    },

    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            { test: /\.tsx?$/, loader: "awesome-typescript-loader" },

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
        ]
    },

    plugins: [
        new LiveReloadPlugin(),
        new CheckerPlugin(),
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: "vendor",
        // }),
        new webpack.DefinePlugin({
            "process.env": {
                BASE_URL: JSON.stringify(baseUrl),
                PARSE_URL: JSON.stringify(parseUrl),
                NODE_ENV: JSON.stringify(nodeEnv)
            }
        })
    ]
};

// if (isProd)
//     config.plugins.push(new webpack.optimize.UglifyJsPlugin());

module.exports = config;

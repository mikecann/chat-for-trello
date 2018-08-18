const path = require("path");
module.exports = (baseConfig, env, config) => {
    config.module.rules.push({
        test: /\.(ts|tsx)$/,
        loader: require.resolve("awesome-typescript-loader")
    });
    config.module.rules.push({
        test: /\.(png|jpg|gif)$/,
        use: [
            {
                loader: "file-loader",
                options: {}
            }
        ]
    });
    config.resolve.extensions.push(".ts", ".tsx");
    return config;
};

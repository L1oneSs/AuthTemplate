import path from "path";

module.exports = {
    // Другие настройки вашего конфигурационного файла
    module: {
        rules: [
            // Ваши другие правила
            {
                test: /\.svg$/,
                use: ["@svgr/webpack"],
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
};

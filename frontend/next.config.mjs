/** @type {import('next').NextConfig} */
const nextConfig = {
    // output: "export",
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/, // определяем формат файла
            use: [
                {
                    loader: "@svgr/webpack", // добавляем лоадер для использования SVGR
                    options: {
                        icon: true, // опционально, включить режим иконок
                    },
                },
            ],
        });

        return config;
    },
};

export default nextConfig;

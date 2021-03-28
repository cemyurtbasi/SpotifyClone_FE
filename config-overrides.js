module.exports = (config, env) => {
    config.module.rules.push({
      test: /\.scss$/,
      use: [
        {
          loader: "sass-resources-loader",
          options: {
            // Provide path to the file with resources
            resources: "./src/Assets/styles/fileSass/utils.scss",
          },
        },
      ],
    });
    return config;
  };
  
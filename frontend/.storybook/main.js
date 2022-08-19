module.exports = {
  stories: [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: "@storybook/react",
  core: {
    builder: {
      name: "@storybook/builder-webpack5",
      options: {
        webpackDevMiddleware: (config) => {
          config.watchOptions = {
            poll: 1000,
            aggregateTimeout: 300,
          };
          return config;
        },
      },
    },
  },
};
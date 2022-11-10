const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: ["babel-polyfill", "./src/index.tsx"],
  mode: "development",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        options: { presets: ["@babel/env"] },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|jp2|webp)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
        },
      },
      {
        test: [/\.eot$/, /\.ttf$/, /\.svg$/, /\.woff$/, /\.woff2$/],
        loader: require.resolve("file-loader"),
        options: {
          name: "/static/media/[name].[hash:8].[ext]",
        },
      },
      {
        test: /\.less$/i,
        use: ["style-loader", "css-loader", "less-loader"],
      },
    ],
  },
  resolve: { extensions: ["*", ".js", ".jsx", ".tsx", ".ts"] },
  output: {
    path: path.resolve(__dirname, "dist/"),
    publicPath: "/",
    filename: "bundle.js",
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "static"),
    },
    compress: true,
    port: 9000,
    historyApiFallback: true,
    allowedHosts: "all",
  },
  plugins: [
      new webpack.HotModuleReplacementPlugin()
  ],
};

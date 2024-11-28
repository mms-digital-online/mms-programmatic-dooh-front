"use stict";

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const GenerateJsonPlugin = require("generate-json-webpack-plugin");
const makeConfig = require("./make-config");

module.exports = (env, argv) => {
  const development = argv.mode === "development";
  const analytics = !!(env && env.BUNDLE_ANALYZER === "true");

  return {
    mode: development ? "development" : "production",
    ...(development && { devtool: "source-map" }),
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: ["babel-loader", "eslint-loader"],
          exclude: /node-modules/,
        },
        ...(development
          ? [
              {
                test: /\.jsx?$/,
                use: ["source-map-loader"],
                enforce: "pre",
              },
            ]
          : []),
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    ...(development && {
      devServer: {
        disableHostCheck: true,
        hot: true,
        host: "0.0.0.0",
        port: 3000,
        historyApiFallback: true,
      },
    }),
    plugins: [
      ...(analytics ? [new BundleAnalyzerPlugin()] : []),
      new HtmlWebpackPlugin({
        template: "./index.html",
        inject: false,
      }),
      new GenerateJsonPlugin("config.json", makeConfig()),
    ],
  };
};

import path from "path";
import { Configuration } from "webpack";
import sass from "sass";
import { merge } from "webpack-merge";
import common from "./webpack.common.config";
import Dotenv from "dotenv-webpack";

const config: Configuration = {
  mode: "development",
  output: {
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/i,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react", "@babel/preset-typescript"],
          },
        },
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "sass-loader",
            options: { implementation: sass },
          },
        ],
      },
    ],
  },
  devtool: "inline-source-map",
  devServer: {
    static: path.join(__dirname, "build"),
    historyApiFallback: true,
    port: 4000,
    open: true,
  },
  plugins: [
    new Dotenv({
      path: path.resolve(__dirname, '../.env'),
      allowEmptyValues: true,
      systemvars: true,
      silent: true,
    })
  ],
};

export default merge(common, config);

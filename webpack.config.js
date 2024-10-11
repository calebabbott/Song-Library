import { resolve } from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import webpack from 'webpack';
const { DefinePlugin } = webpack;
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, "..");

export default {
  mode: "development",
  entry: {
    mychurch: "./src/mychurch.js", // Entry point for mychurch.js
    login: "./src/login.js"        // Entry point for login.js
  },
  output: {
    filename: "[name].bundle.js",  // Use entry name to create separate bundles
    path: resolve(__dirname, "dist"),
    clean: true,
  },
  devtool: "eval-source-map",
  devServer: {
    static: resolve(__dirname, "dist"),
    watchFiles: ["./src/login.html", "./src/mychurch.html"],
    historyApiFallback: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/login.html",
      filename: "login.html",
      chunks: ["login"],  // Include only login.js in this HTML
    }),
    new HtmlWebpackPlugin({
      template: "./src/mychurch.html",
      filename: "mychurch.html",
      chunks: ["mychurch"], // Include only mychurch.js in this HTML
    }),
    new DefinePlugin({
      'process.env.SUPABASE_KEY': JSON.stringify(process.env.SUPABASE_KEY)
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
};

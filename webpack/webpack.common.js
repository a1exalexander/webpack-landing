const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const postcssPresetEnv = require("postcss-preset-env");
const helpers = require("./helpers");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: helpers.getEntry(),
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "[name]"
  },
  devServer: {
    stats: "errors-only",
    port: 3000,
    hot: true,
    overlay: true
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      },
      {
        test: /\.(html)$/,
        use: [
          {
            loader: "html-loader",
            options: {
              esModule: false,
              attrs: ["img:src", "img:data-src", "link:href"]
            }
          }
        ]
      },
      {
        test: /\.(webmanifest|xml|ico|txt)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "public",
              name: "[name].[ext]",
              esModule: false
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "assets/fonts",
              name: "[name].[ext]",
              esModule: false
            }
          }
        ]
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "css",
              name: "[name].css",
              esModule: false
            }
          },
          {
            loader: "extract-loader"
          },
          "css-loader",
          "sass-loader",
          {
            loader: "postcss-loader",
            options: {
              ident: "postcss",
              plugins: () => [postcssPresetEnv()]
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      { from: path.join(__dirname, helpers.src.STATIC), to: "public" }
    ])
  ].concat(helpers.templatePlugin())
};

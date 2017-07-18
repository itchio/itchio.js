var path = require("path");

module.exports = {
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "itchio.js",
    library: "Itch",
    libraryTarget: "window",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "itchio.min.js",
    library: "Itch",
    libraryTarget: "window",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    loaders: [
      { test: /\.tsx?$/, loader: "ts-loader" },
    ],
  },
};

module.exports = {
  devtool: "source-map",
  entry: "./dist/index.js",
  output: {
    pathinfo: true,
    filename: "3web.udm.js",
    sourceMapFilename: "./3web.udm.js.map",
    library: {
      type: "umd",
      name: "ThirdWeb",
    },
    // prevent error: `Uncaught ReferenceError: self is not define`
    globalObject: "this",
  },
};

// webpack.config.js -> module.rules
{
  [
    {
      test: /\.pug$/,
      loader: "pug-plain-loader"
    },
    {
      test: /\.scss$/,
      use: [
        "vue-style-loader",
        "css-loader",
        {
          loader: "sass-loader",
          options: {
            implementation: require("sass"),
            sassOptions: {
              fiber: require("fibers"),
              indentedSyntax: true // optional
            }
          }
        }
      ]
    }
  ];
}

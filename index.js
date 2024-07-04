require("dotenv").config();
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");
const expressStaticGzip = require("express-static-gzip");

const app = express();

app.use(cors());

app.use(
  "/api/upload",
  createProxyMiddleware({
    target: "https://tools.betabotz.eu.org/ai/remini",
    changeOrigin: true,
    pathRewrite: {
      "^/upload": "",
    },
  })
);

app.use(
  "/api/download",
  createProxyMiddleware({
    target: "https://btch.pages.dev/file/",
    changeOrigin: true,
    pathRewrite: (path, req) => {
      const imageId = req.query.imageId;
      if (imageId) {
        return `/${imageId}`;
      }
      return "/";
    },
  })
);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Proxy server is running on port ${PORT}`);
});

if (process.env.NODE_ENV === "production") {
  // run for gzip
  app.use(expressStaticGzip("client/dist"));
  // Express will serve up production assets
  // like our main.js file, or main.css file!
  app.use(express.static("client/dist"));

  // Express will serve up the index.html file
  // if it doesn't recognize the route
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"), {
      removeAttributeQuotes: true,
    });
  });
}

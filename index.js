require("dotenv").config();
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");
const expressStaticGzip = require("express-static-gzip");

const app = express();

app.use(
  cors({
    origin: "https://remini-web-self.vercel.app",
    methods: "GET, POST, PUT, DELETE",
    credentials: true,
  })
);
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

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
  app.get("/", (req, res) => {
    res.status(200).json({ message: "Server Work" });
  });
  // // run for gzip
  // app.use(expressStaticGzip("client/dist"));
  // // Express will serve up production assets
  // // like our main.js file, or main.css file!
  // app.use(express.static("client/dist"));

  // // Express will serve up the index.html file
  // // if it doesn't recognize the route
  // app.get("*", (req, res) => {
  //   res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"), {
  //     removeAttributeQuotes: true,
  //   });
  // });
}

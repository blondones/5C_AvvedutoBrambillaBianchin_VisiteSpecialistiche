const dbComponent = require("./scripts/database.js");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const http = require("http");
const app = express();
const fs = require('fs');
const conf = JSON.parse(fs.readFileSync('config.json'));
conf.ssl.ca = fs.readFileSync(__dirname + '/ca.pem');
const db = dbComponent(conf);

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use("/", express.static(path.join(__dirname, "public")));


app.post("/insert", async (req, res) => {
    const visit = req.body.visit;
  await db.insert(visit);
  res.json({result: "ok" });
  });
  

app.get("/visits", async(req, res) => {
  const imgs = await db.select();
  res.json({ imgs: imgs });
});

app.delete("/delete/:id", async(req, res) => {
  let imgs = await db.select();
  imgs = imgs.filter((element) => element.id == req.params.id);
  await db.del(imgs[0]);
  res.json({ result: "Ok" });
});

const server = http.createServer(app);
server.listen(80, () => {
  console.log("Server running on port 80");
});
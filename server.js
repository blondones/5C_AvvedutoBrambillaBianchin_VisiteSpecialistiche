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
app.use("/moment/dist/moment.js", express.static(path.join(__dirname, "/node_modules/moment/dist/moment.js")));


app.post("/insert", async (req, res) => {
    const visit = req.body;
  await db.insert(visit);
  res.json({result: "ok" });
  });
  

app.get("/visits", async(req, res) => {
  const visits = await db.select();
  console.log(visits)
  res.json({ visits: visits });
});

app.get("/types", async(req, res) => {
  const types = await db.selectTypes();
  res.json({ types: types });
});


const server = http.createServer(app);
server.listen(80, () => {
  console.log("Server running on port 80");
});
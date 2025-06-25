console.log("Carregando... (0/2)")
const path = require("path")
const express = require("express");
const conn_DB = require("./conn");
const rotas = require("./routes")
const cors = require("cors")
require("dotenv")
const app = express();
const port = 3030;

app.use(express.json())
app.use(cors());
app.use("/api", rotas)
conn_DB()

app.use(express.static(path.join(__dirname, "../frontend")));

app.listen(port, () => {
  console.log(`Carregando... (1/2)`);
});
const express = require("express");
const conn_DB = require("./conn");
const rotas = require("./routes")
const cors = require("cors")
require("dotenv")
const app = express();
const port = 3000;

app.use(express.json())
app.use(cors())
app.use("/api",rotas)
conn_DB()

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});


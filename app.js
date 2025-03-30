const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const app = express();
const port = 3000;
require("./conn")

app.use(express.json())

// Serve os arquivos estáticos da pasta 'public'
app.use(express.static('public'));

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

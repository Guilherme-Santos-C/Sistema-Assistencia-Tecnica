const express = require('express');
const { verificaTokenAdmin, verificaTokenUser } = require("./middlewares/authMiddleware");
const imprimir_pdf_saida = require("./pdfSaida")
const imprimir_pdf_relatorio = require("./pdfRelatorio")
const { validaTokenAdmin, validaTokenUser} = require("./validaToken");
const login = require("./login")
const router = express.Router();

const UserControllers = require("./controllers/UserControllers");
const AdminControllers = require("./controllers/AdminControllers");
const ClientesControllers = require("./controllers/ClientesControllers");
const EquipamentoControllers = require("./controllers/EquipamentoControllers");
const OsControllers = require("./controllers/OsControllers");
const numeroOsControllers = require('./controllers/NumeroOsController');

// Rotas do Admin
router.post("/admin", AdminControllers.create);
router.put("/admin", AdminControllers.trocar_senha);

// Rotas dos Usuários   
router.post("/usuarios", UserControllers.create);
router.get("/usuarios/procurar", UserControllers.procurar);
router.get("/usuarios", verificaTokenAdmin, UserControllers.listar);
router.put("/usuarios", UserControllers.editar);
router.delete("/usuarios/:id", verificaTokenAdmin, UserControllers.delete);

// Rotas dos Clientes (usuário comum pode acessar)
router.post("/clientes", verificaTokenUser, ClientesControllers.create);
router.get("/clientes", verificaTokenUser, ClientesControllers.listar);
router.get("/clientes/procurar", verificaTokenUser, ClientesControllers.procurar);
router.put("/clientes", verificaTokenUser, ClientesControllers.editar);
router.delete("/clientes", verificaTokenUser, ClientesControllers.delete);

// Rotas das Ordens de Serviço (OS)
router.post("/ordens", verificaTokenUser, OsControllers.create);
router.get("/ordens", verificaTokenUser, OsControllers.listar);
router.get("/ordens/procurar", verificaTokenUser, OsControllers.procurar);
router.put("/ordens", verificaTokenUser, OsControllers.editar);
router.delete("/ordens", verificaTokenUser, OsControllers.delete);
router.get("/ordens/numero", verificaTokenUser, numeroOsControllers.adicionarUm);

// Rotas dos Equipamentos
router.post("/equipamentos", verificaTokenUser, EquipamentoControllers.create);
router.get("/equipamentos", verificaTokenUser, EquipamentoControllers.listar);
router.get("/equipamentos/procurar", verificaTokenUser, EquipamentoControllers.procurar);
router.put("/equipamentos/:id", verificaTokenUser, EquipamentoControllers.editar);
router.delete("/equipamentos/:id", verificaTokenUser, EquipamentoControllers.delete);

// Login
router.post("/login", login)

// Verifica token
router.get("/verificaTokenUser", validaTokenUser)
router.get("/verificaTokenAdmin", validaTokenAdmin)

// PDF de saída
router.post("/protocoloDeSaida", verificaTokenUser, imprimir_pdf_saida)
router.post("/relatorio", verificaTokenUser, imprimir_pdf_relatorio)

// Listar clientes e ordens com filto de data
router.post("/ordens/data", verificaTokenUser)
router.post("/clientes/data", verificaTokenUser)

module.exports = router;

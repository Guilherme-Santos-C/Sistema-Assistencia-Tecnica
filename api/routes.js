const express = require('express');
const { verificaTokenAdmin, verificaTokenUser } = require("./middlewares/authMiddleware");
const login = require("./login")
const router = express.Router();

const UserControllers = require("./controllers/UserControllers");
const AdminControllers = require("./controllers/AdminControllers");
const ClientesControllers = require("./controllers/ClientesControllers");
const EquipamentoControllers = require("./controllers/EquipamentoControllers");
const OsControllers = require("./controllers/OsControllers");

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
router.get("/clientes/:id", verificaTokenUser, ClientesControllers.procurar);
router.put("/clientes/:id", verificaTokenUser, ClientesControllers.editar);
router.delete("/clientes/:id", verificaTokenUser, ClientesControllers.delete);

// Rotas das Ordens de Serviço (OS)
router.post("/ordens", verificaTokenUser, OsControllers.create);
router.get("/ordens", verificaTokenUser, OsControllers.listar);
router.get("/ordens/:id", verificaTokenUser, OsControllers.procurar);
router.put("/ordens/:id", verificaTokenUser, OsControllers.editar);
router.delete("/ordens/:id", verificaTokenUser, OsControllers.delete);

// Rotas dos Equipamentos
router.post("/equipamentos", verificaTokenUser, EquipamentoControllers.create);
router.get("/equipamentos", verificaTokenUser, EquipamentoControllers.listar);
router.get("/equipamentos/:id", verificaTokenUser, EquipamentoControllers.procurar);
router.put("/equipamentos/:id", verificaTokenUser, EquipamentoControllers.editar);
router.delete("/equipamentos/:id", verificaTokenUser, EquipamentoControllers.delete);

// Login
router.post("/login", login)

module.exports = router;

const UserModel = require("../models/User")

require("../models/User")

const UserControllers = {
    create: async (req, res) => {
        try {
            const User = {
                nome: req.body.nome,
                email: req.body.email,
                password: req.body.password,
                cpf: req.body.cpf
            }
            const reposta_db = await UserModel.create(User);
            res.status(200).json({reposta_db, mensagem: "Usuário criado com sucesso!"})
        }
        catch (err) {
            console.log(err)
            res.json({mensagem: `${err}`})
        }
    },
    delete: async (req, res) => {}
    ,
    editar: async (req, res) => {}
    ,
    listar: async (req, res) => {}

}

module.exports = UserControllers;
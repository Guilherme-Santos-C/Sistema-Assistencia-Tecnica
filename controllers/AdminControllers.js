const AdminModel = require("../models/Admin")

const AdminControllers = {
    create: async (req, res) => {
        try{
            const resposta_db = await AdminModel.findOne({nome: "Admin"})
            if(!resposta_db){
                await AdminModel.create({nome: "Admin", password: "Admin"}) 
                return res.status(201).json({msg : "Admin criado com sucesso!"}) 
            }
            res.status(400).json({msg: "O Admin já existe!"})
        }
        catch(err){
            console.log(err)
            res.status(500).json({msg: err})
        }
    },
    trocar_senha: async (req, res) => {
        try {
            const Admin = await AdminModel.findOne({nome: "Admin"})
            if(!Admin){
                return res.status(404).json({msg: "Admin nao cadastrado"})
            }
            Admin.password = req.body.password;
            await Admin.save()
            res.status(200).json({mensagem: "Senha trocada com sucesso!"})
        }
        catch (err) {
            console.log(err)
            res.status(500).json({mensagem: `${err}`})
        }
    }
}

module.exports = AdminControllers;
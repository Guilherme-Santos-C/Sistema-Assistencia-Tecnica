const UserModel = require("../models/User")

const UserControllers = {
    create: async (req, res) => {
        try {

            // PRECISA DA SENHA DO ADMIN
            const User = {
                nome: req.body.nome,
                cpf: req.body.cpf,
                endereco: req.body.endereco,
                telefone: req.body.telefone
            }

            //verificando se User já existe
            const cpf_existe = await UserModel.findOne({cpf: User.cpf})

            if(cpf_existe) return res.status(400).json({mensagem: "Este User já existe!"})

            const resposta_db = await UserModel.create(User);

            res.status(201).json({resposta_db, mensagem: "User criado com sucesso!"})
        }
        catch (err) {
            console.log(err)
            res.status(500).json({mensagem: `${err}`})
        }
    }
    ,
    delete: async (req, res) => {   
        try{
            const resposta_db = await UserModel.findByIdAndDelete(req.body.id)
            if(!resposta_db) return res.status(404).json({mensagem: "O User não existe"})
            res.status(200).json({mensagem: "User deletado com sucesso"})
        }
        catch(err){
            console.log(err)
            res.status(500).json({mensagem: `${err}`})
        }
    }
    ,
    edit: async (req, res) => {
        try{
            const User = await UserModel.findOne({cpf: req.body.cpf})
            if(!User) return res.status(404).json({mensagem: "O User não existe!"})
            if(req.body.nome) User.nome = req.body.nome
            if(req.body.endereco) User.endereco = req.body.endereco
            if(req.body.telefone) User.telefone = req.body.telefone
            await User.save()
            res.status(200).json({mensagem: "Informações atualizadas com sucesso"})
        }
        catch(err){
            console.log(err)
            res.status(500).json({mensagem: `${err}`})
        }
    }
    ,
    listar: async (req, res) => {
        try{
            const resposta_db = await UserModel.find()
            return res.status(200).json({resposta_db})
        }
        catch(err){
            console.log(err)
            res.status(500).json({mensagem: `${err}`})
        }
    }
}

module.exports = UserControllers;
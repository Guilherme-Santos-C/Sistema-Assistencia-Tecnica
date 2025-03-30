const ClienteModel = require("../models/Cliente")

const ClienteControllers = {
    create: async (req, res) => {
        try {
            const Cliente = {
                nome: req.body.nome,
                cpf: req.body.cpf,
                endereco: req.body.endereco,
                telefone: req.body.telefone
            }

            //verificando se cliente já existe
            const cpf_existe = await ClienteModel.findOne({cpf: Cliente.cpf})

            if(cpf_existe) return res.status(400).json({mensagem: "Este Cliente já existe!"})

            const resposta_db = await ClienteModel.create(Cliente);

            res.status(201).json({resposta_db, mensagem: "Cliente criado com sucesso!"})
        }
        catch (err) {
            console.log(err)
            res.status(500).json({mensagem: `${err}`})
        }
    }
    ,
    delete: async (req, res) => {   
        try{
            const resposta_db = await ClienteModel.findByIdAndDelete(req.body.id)
            if(!resposta_db) return res.status(404).json({mensagem: "O cliente não existe"})
            res.status(200).json({mensagem: "Cliente deletado com sucesso"})
        }
        catch(err){
            console.log(err)
            res.status(500).json({mensagem: `${err}`})
        }
    }
    ,
    edit: async (req, res) => {
        try{
            const Cliente = await ClienteModel.findOne({cpf: req.body.cpf})
            if(!Cliente) return res.status(404).json({mensagem: "O cliente não existe!"})
            if(req.body.nome) Cliente.nome = req.body.nome
            if(req.body.endereco) Cliente.endereco = req.body.endereco
            if(req.body.telefone) Cliente.telefone = req.body.telefone
            await Cliente.save()
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
            const resposta_db = await ClienteModel.find()
            return res.status(200).json({resposta_db})
        }
        catch(err){
            console.log(err)
            res.status(500).json({mensagem: `${err}`})
        }
    }
}

module.exports = ClienteControllers;
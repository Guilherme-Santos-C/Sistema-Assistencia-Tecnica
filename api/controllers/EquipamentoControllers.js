const EquipamentoModel = require("../models/Equipamento");

const EquipamentoControllers = {
    create: async (req, res) => {
        try {
            const Equipamento = {
                marca: req.body.marca,
                modelo: req.body.modelo,
                cor: req.body.cor,
                caracteristica: req.body.caracteristica,
                observacoes: req.body.observacoes
            }
            const resposta_db = await EquipamentoModel.create(Equipamento);
            res.status(201).json({resposta_db, mensagem: "Equipamento criado com sucesso!"})
        }
        catch (err) {
            console.log(err)
            res.status(500).json({mensagem: "Erro interno!"})
        }
    }
    ,
    delete: async (req, res) => {   
        try{
            // id vem na url
            const resposta_db = await EquipamentoModel.findByIdAndDelete(req.params.id)
            if(!resposta_db) return res.status(404).json({mensagem: "O Equipamento não existe"})
            res.status(200).json({mensagem: "Equipamneto deletado com sucesso"})
        }
        catch(err){
            console.log(err)
            res.status(500).json({mensagem: "Erro interno!"})
        }
    }
    ,
    editar: async (req, res) => {
        try{
            // id vem na url
            const Equipamento = await EquipamentoModel.findOne({id: req.params.id})
            if(!Equipamento) return res.status(404).json({mensagem: "O Equipamento não existe!"})
            if(req.body.marca) Equipamento.marca = req.body.marca
            if(req.body.modelo) Equipamento.modelo = req.body.modelo
            if(req.body.cor) Equipamento.cor = req.body.cor
            if(req.body.caracteristica) Equipamento.caracteristica = req.body.caracteristica
            if(req.body.observacoes) Equipamento.observacoes = req.body.observacoes
            await Equipamento.save()
            res.status(200).json({mensagem: "Informações atualizadas com sucesso"})
        }
        catch(err){
            console.log(err)
            res.status(500).json({mensagem: "Erro interno"})
        }
    }
    ,
    procurar: async (req, res) => {
        try {
            if(!req.params.id) res.status(400).json({mensagem: "Precisa do id"})
            const Equipamento = await EquipamentoModel.findById(req.params.id)
            if(!Equipamento) res.status(404).json({mensagem: "O equipamento não existe!"})
            res.status(200).json({Equipamento})
        }
        catch(err){
            console.log(err)
            res.status(500).json({mensagem: "Erro interno!"})
        }
    }
    ,
    listar: async (req, res) => {
        try{
            const Equipamentos = await EquipamentoModel.find()
            return res.status(200).json({Equipamentos})
        }
        catch(err){
            console.log(err)
            res.status(500).json({mensagem: "Erro interno!"})
        }
    }
}

module.exports = EquipamentoControllers;
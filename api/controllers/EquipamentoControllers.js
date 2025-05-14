const EquipamentoModel = require("../models/Equipamento");

const EquipamentoControllers = {
    create: async (req, res) => {
        try {
            const equipamento = {
                marca: req.body.marca,
                modelo: req.body.modelo,
                cor: req.body.cor,
                observacoes: req.body.observacoes
            };
            const resposta_db = await EquipamentoModel.create(equipamento);
            res.status(201).json(resposta_db);
        } catch (err) {
            console.log(err);
            res.status(500).json({ mensagem: "Erro interno!" });
        }
    },

    delete: async (req, res) => {   
        try {
            const resposta_db = await EquipamentoModel.findByIdAndDelete(req.query.id);
            if (!resposta_db) return res.status(404).json({ mensagem: "O equipamento não existe!" });

            res.status(200).json({ mensagem: "Equipamento deletado com sucesso!" });
        } catch (err) {
            console.log(err);
            res.status(500).json({ mensagem: "Erro interno!" });
        }
    },

    editar: async (req, res) => {
        try {
            const equipamento = await EquipamentoModel.findById(req.query.id);
            if (!equipamento) return res.status(404).json({ mensagem: "O equipamento não existe!" });

            if (req.body.marca) equipamento.marca = req.body.marca;
            if (req.body.modelo) equipamento.modelo = req.body.modelo;
            if (req.body.cor) equipamento.cor = req.body.cor;
            if (req.body.observacoes) equipamento.observacoes = req.body.observacoes;

            await equipamento.save();
            res.status(200).json({ mensagem: "Informações atualizadas com sucesso!" });
        } catch (err) {
            console.log(err);
            res.status(500).json({ mensagem: "Erro interno!" });
        }
    },

    procurar: async (req, res) => {
        try {
            if(!req.query.id) return res.status(400).json({ mensagem: "Precisa do id" });
            const equipamento = await EquipamentoModel.findById(req.query.id);
            if (!equipamento) return res.status(404).json({ mensagem: "O equipamento não existe!" });
            res.status(200).json(equipamento);
        } catch (err) {
            console.log(err);
            res.status(500).json({ mensagem: "Erro interno!" });
        }
    },

    listar: async (req, res) => {
        try {
            const param_busca = req.query.busca || "";
            let equipamentos;

            if (param_busca) {
                equipamentos = await EquipamentoModel.find({
                    $or: [
                        { marca: { $regex: param_busca, $options: "i" } },
                        { modelo: { $regex: param_busca, $options: "i" } }
                    ]
                }).sort({ createdAt: -1 });
            } else {
                equipamentos = await EquipamentoModel.find().sort({ createdAt: -1 });
            }

            res.status(200).json({ equipamentos });
        } catch (err) {
            console.log(err);
            res.status(500).json({ mensagem: "Erro interno!" });
        }
    }
};

module.exports = EquipamentoControllers;

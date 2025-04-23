const OsModel = require("../models/Os");

const OsControllers = {
    create: async (req, res) => {
        try {
            const Os = {
                equipamento_id: req.body.equipamento_id,
                cliente_id: req.body.cliente_id,
                status: req.body.status,
                cpf: req.body.cpf,
                orcamento: req.body.orcamento,
                diagnostico: req.body.diagnostico,
                observacoes: req.body.observacoes
            };

            const resposta_db = await OsModel.create(Os);
            res.status(201).json({ resposta_db, mensagem: "Ordem de serviço criada com sucesso!" });
        } catch (err) {
            console.log(err);
            res.status(500).json({ mensagem: "Erro interno!" });
        }
    },

    delete: async (req, res) => {
        try {
            const resposta_db = await OsModel.findByIdAndDelete(req.body.id);
            if (!resposta_db) {
                return res.status(404).json({ mensagem: "Ordem de serviço não encontrada!" });
            }
            res.status(200).json({ mensagem: "Ordem de serviço deletada com sucesso!" });
        } catch (err) {
            console.log(err);
            res.status(500).json({ mensagem: "Erro interno!" });
        }
    },

    editar: async (req, res) => {
        try {
            const os = await OsModel.findById(req.body.id);
            if (!os) {
                return res.status(404).json({ mensagem: "Ordem de serviço não encontrada!" });
            }
            if (req.body.equipamento_id) os.equipamento_id = req.body.equipamento_id;
            if (req.body.cliente_id) os.cliente_id = req.body.cliente_id;
            if (req.body.status) os.status = req.body.status;
            if (req.body.cpf) os.cpf = req.body.cpf;
            if (req.body.orcamento) os.orcamento = req.body.orcamento;
            if (req.body.diagnostico) os.diagnostico = req.body.diagnostico;
            if (req.body.observacoes) os.observacoes = req.body.observacoes;
            await os.save();
            res.status(200).json({ mensagem: "Ordem de serviço atualizada com sucesso!" });
        } catch (err) {
            console.log(err);
            res.status(500).json({ mensagem: "Erro interno!" });
        }
    },
    procurar: async (req, res) => {
        try {
            if (!req.params.id) res.status(400).json({ mensagem: "Precisa do id" })
            const cliente = await ClienteModel.findById(req.params.id)
            if (!cliente) res.status(404).json({ mensagem: "Cliente não existe!" })
            res.status(200).json(cliente)
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ mensagem: "Erro interno!" })
        }
    }
    ,

    listar: async (req, res) => {
        try {
            const resposta_db = await OsModel.find();
            res.status(200).json(resposta_db);
        } catch (err) {
            console.log(err);
            res.status(500).json({ mensagem: "Erro interno!" });
        }
    }
};

module.exports = OsControllers;

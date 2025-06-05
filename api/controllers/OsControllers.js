const OsModel = require("../models/Os");
const ClienteModel = require("../models/Cliente")
const imprimir_pdf = require("../controllers/pdfRecebimento")

const OsControllers = {
    create: async (req, res) => {
        try {

            if (isNaN(req.body.orcamento)) {
                return res.status(404).json({ mensagem: "O campo de orçamento precisa ser númerico" })
            }

            const nome_usuario = req.body.nome_usuario;
            const cpf_usuario = req.body.cpf_usuario;
            const nome_equipamento = req.body.nome_equipamento;
            const marca_equipamento = req.body.marca_equipamento;
            const os = {
                equipamento: req.body.equipamento_id,
                cliente: req.body.cliente_id,
                numero: req.body.numero,
                status: req.body.status,
                orcamento: req.body.orcamento,
                diagnostico: req.body.diagnostico,
                observacoes: req.body.observacoes,
            };

            const resposta_db = await OsModel.create(os);

            const Data = new Date();
            const mes = (Data.getMonth() + 1).toString().padStart(2, '0');
            const dia = Data.getDate().toString().padStart(2, '0');
            const ano = Data.getFullYear();
            const data = `${dia}/${mes}/${ano}`;

            const pdfBuffer = await imprimir_pdf(
                nome_usuario,
                cpf_usuario,
                nome_equipamento,
                marca_equipamento,
                data,
                os.numero
            );

            const pdfBase64 = pdfBuffer.toString('base64');

            res.status(201).json({
                mensagem: "Ordem de serviço criada com sucesso!",
                pdf: pdfBase64,
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({ mensagem: "Erro interno!" });
        }
    },

    delete: async (req, res) => {
        try {
            if (req.query.id_cliente == undefined) {
                const resposta_db = await OsModel.findByIdAndDelete(req.query.id);
                if (!resposta_db) return res.status(404).json({ mensagem: "Ordem de serviço não encontrada!" });
                res.status(200).json({ mensagem: "Ordem de serviço deletada com sucesso!" });
            } else {
                const resposta_db = await OsModel.deleteMany({ cliente: req.query.id_cliente });
                if (!resposta_db) return res.status(404).json({ mensagem: "Ordens de serviço não encontradas!" });
                res.status(200).json({ mensagem: "Ordens de serviço deletadas com sucesso!" });
            }

        } catch (err) {
            console.log(err);
            res.status(500).json({ mensagem: "Erro interno!" });
        }
    },

    editar: async (req, res) => {
        try {
            if (isNaN(req.body.orcamento)) {
                return res.status(404).json({ mensagem: "O campo de orçamento precisa ser númerico" })
            }

            const os = await OsModel.findById(req.query.id);
            if (!os) return res.status(404).json({ mensagem: "Ordem de serviço não encontrada!" });

            if (req.body.equipamento_id) os.equipamento_id = req.body.equipamento_id;
            if (req.body.cliente_id) os.cliente_id = req.body.cliente_id;
            os.status = req.body.status;
            os.orcamento = req.body.orcamento;
            os.diagnostico = req.body.diagnostico;
            os.observacoes = req.body.observacoes;

            await os.save();
            res.status(200).json({ mensagem: "Ordem de serviço atualizada com sucesso!" });
        } catch (err) {
            console.log(err);
            res.status(500).json({ mensagem: "Erro interno!" });
        }
    },

    procurar: async (req, res) => {
        try {
            if (!req.query.id) return res.status(400).json({ mensagem: "Precisa do id" });

            const os = await OsModel.findById(req.query.id);
            if (!os) return res.status(404).json({ mensagem: "Ordem de serviço não encontrada!" });

            res.status(200).json(os);
        } catch (err) {
            console.log(err);
            res.status(500).json({ mensagem: "Erro interno!" });
        }
    },

    listar: async (req, res) => {
        try {
            const param_busca = req.query.busca || ""
            if (param_busca == "") {
                let Oss = await OsModel.find().sort({ createdAt: -1 }).limit(50);
                return res.status(200).json(Oss)
            }
            let resposta_db_numero = await OsModel.find({ numero: { $regex: "^" + param_busca } }).sort({ createdAt: -1 }).limit(30);
            let cliente = await ClienteModel.findOne({
                cpf: { $regex: "^" + param_busca }
            })
            let resposta_db_id_cliente = []
            if (cliente != null) {
                resposta_db_id_cliente = await OsModel.aggregate([
                    {
                        $addFields: {
                            idStr: { $toString: "$cliente" }  // converte _id para string
                        }
                    },
                    {
                        $match: {
                            idStr: { $regex: "^" + cliente._id, $options: "i" }
                        }
                    }
                ])
                    .sort({ createdAt: -1 }) // -1 = ordem decrescente (mais novos primeiro)
                    .limit(10);
            }
            resposta_db_id_cliente.map((os) => {
                delete os.idStr
                return os
            })
            let resposta_db = [...resposta_db_numero, ...resposta_db_id_cliente];
            // Remover duplicados com base no _id
            const resposta_db_unica = resposta_db.filter(
                (os, index, self) =>
                    index === self.findIndex((o) => o._id.toString() === os._id.toString())
            );

            res.status(200).json(resposta_db_unica);
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ mensagem: "Erro interno!" })
        }
    },
    listar_filtro_data: async (req, res) => {
        let osS = await OsModel.find({
            createdAt: {
            $gte: req.body.dataInicio,
            $lt: req.body.dataFinal
        }
        })
        if(!osS){
            return res.status(404).json({mensagem: "Nenhuma Ordem encontrada"})
        }
        return res.status(200).json({osS})
    }
};

module.exports = OsControllers;

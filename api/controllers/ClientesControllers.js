const ClienteModel = require("../models/Cliente")

const remove_caracteres_cpf = (cpf) => {
    const cpf_array = [...cpf]
    let cpf_sem_caractere = []
    cpf_array.forEach((e) => {
        if (!isNaN(e)) {
            cpf_sem_caractere.push(e)
        }
    })
    return cpf_sem_caractere.join("")
}

const ClienteControllers = {
    create: async (req, res) => {
        try {
            const Cliente = {
                nome: req.body.nome,
                cpf: req.body.cpf.replace(/[^\d]/g, ""),
                endereco: req.body.endereco,
                telefone: req.body.telefone
            }

            //verificando se cliente já existe
            const cpf_existe = await ClienteModel.findOne({ cpf: Cliente.cpf })

            if (cpf_existe) return res.status(400).json({ mensagem: "Este Cliente já existe!" })

            const resposta_db = await ClienteModel.create(Cliente);

            res.status(201).json({ mensagem: "Cliente criado com sucesso!" })
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ mensagem: "Erro interno!" })
        }
    }
    ,
    delete: async (req, res) => {
        try {
            const resposta_db = await ClienteModel.findByIdAndDelete(req.query.id)
            if (!resposta_db) return res.status(404).json({ mensagem: "O cliente não existe" })
            res.status(200).json({ mensagem: "Cliente deletado com sucesso" })
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ mensagem: "Erro interno!" })
        }
    }
    ,
    editar: async (req, res) => {
        try {
            const Cliente = await ClienteModel.findById(req.query.id)
            if (!Cliente) return res.status(404).json({ mensagem: "O cliente não existe!" })
            if (req.body.nome) Cliente.nome = req.body.nome
            if (req.body.cpf) Cliente.cpf = req.body.cpf.replace(/[^\d]/g, "")
            if (req.body.endereco) Cliente.endereco = req.body.endereco
            if (req.body.telefone) Cliente.telefone = req.body.telefone
            await Cliente.save()
            return res.status(200).json({ mensagem: "Informações atualizadas com sucesso" })
        }
        catch (err) {
            console.log(err)
            return res.status(500).json({ mensagem: "Erro interno, o cpf deve ser único!" })
        }
    }
    ,
    procurar: async (req, res) => {
        try {
            let cliente
            if (!!req.query.id) {
                cliente = await ClienteModel.findById(req.query.id)
            }
            else {
                cliente = await ClienteModel.find({ cpf: req.query.cpf })
            }
            if (!cliente) return res.status(404).json({ mensagem: "Cliente não existe!" })
            return res.status(200).json(cliente)
        }
        catch (err) {
            console.log(err)
            return res.status(500).json({ mensagem: "Erro interno!" })
        }
    }
    ,
    listar: async (req, res) => {
        try {
            let param_busca = (req.query.busca || "")
            let resposta_db
            if (!isNaN(parseFloat(param_busca[0])) && isFinite(param_busca[0])) {
                param_busca = remove_caracteres_cpf(param_busca)
                resposta_db = await ClienteModel.find({
                    cpf: { $regex: "^" + param_busca }
                })
                    .sort({ createdAt: -1 }) // -1 = ordem decrescente (mais novos primeiro)
                    .limit(10);
            } else {
                resposta_db = await ClienteModel.find({
                    nome: { $regex: "^" + param_busca, $options: "i" }
                })
                    .sort({ createdAt: -1 }) // -1 = ordem decrescente (mais novos primeiro)
                    .limit(10);
            }
            res.status(200).json({ resposta_db })
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ mensagem: "Erro interno!" })
        }
    },
    listar_filtro_data: async (req, res) => {
        let Clientes = await ClienteModel.find({
            createdAt: {
                $gte: req.body.dataInicio,
                $lt: req.body.dataFinal
            }
        })
        if (!Clientes) {
            return res.status(404).json({ mensagem: "Nenhum cliente encontrado" })
        }
        return res.status(200).json({Clientes})
    }
}

module.exports = ClienteControllers;
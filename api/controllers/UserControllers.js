const UserModel = require("../models/User.js");
const AdminModel = require("../models/Admin.js")
const bcrypt = require("bcrypt")

const remove_caracteres_cpf = (cpf) => {
    const cpf_array = [...cpf]
    let cpf_sem_caractere = []
    cpf_array.forEach((e) => {
        if(!isNaN(e)){
            cpf_sem_caractere.push(e)
        }
    })
    return cpf_sem_caractere.join("")
}

const UserControllers = {
    create: async (req, res) => {
        try {
            const User = {
                nome: req.body.nome,
                email: req.body.email,
                password: req.body.password,
                cpf: remove_caracteres_cpf(req.body.cpf)
            }
            const cpf_existe = await UserModel.findOne({ cpf: User.cpf })
            if (cpf_existe) return res.status(400).send({ mensagem: "Este Usuário já existe!" })
            const Admin = await AdminModel.findOne({ nome: "Admin" })
            if(Admin.password != "Admin"){
                let verifica_admin = await bcrypt.compare(req.body.password_admin, Admin.password)
                if(!verifica_admin) return res.json({ mensagem: "Senha do admin inválida" }).status(400)
            }
            if(Admin.password != req.body.password_admin) return res.status(400).json({ mensagem: "Senha do admin inválida" })
            const salt = await bcrypt.genSalt(12)
            const passwordHash = await bcrypt.hash(User.password, salt)
            User.password = passwordHash
            const resposta_db = await UserModel.create(User);
            res.status(201).json({ mensagem: "Usuário criado com sucesso!" })
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ mensagem: "Erro interno!" })
        }
    }
    ,
    delete: async (req, res) => {
        try {
            // id vem na url
            const resposta_db = await UserModel.findByIdAndDelete(req.params.id)
            if (!resposta_db) return res.status(404).json({ mensagem: "O Usuário não existe" })
            res.status(200).json({ mensagem: "Usuário deletado com sucesso" })
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ mensagem: "Erro interno!" })
        }
    }
    ,
    editar: async (req, res) => {
        try {
            // id vem na url
            const User = await UserModel.findById(req.query.id)
            if (!User) return res.status(404).json({ mensagem: "O Usuário não existe!" })
            const Admin = await AdminModel.findOne({ nome: "Admin" })
            if(Admin.password != "Admin"){
                let verifica_admin = await bcrypt.compare(req.query.admin, Admin.password)
                if(!verifica_admin) return res.json({ mensagem: "Senha do admin inválida" }).status(400)
            }
            if(Admin.password != req.query.admin) return res.status(400).json({ mensagem: "Senha do admin inválida" })
            if (req.body.nome) User.nome = req.body.nome
            if (req.body.email) User.email = req.body.email
            if (req.body.password){
                const salt = await bcrypt.genSalt(12)
                const passwordHash = await bcrypt.hash(req.body.password, salt)
                User.password = passwordHash
            } 
            await User.save()
            res.status(200).json({ mensagem: "Informações atualizadas com sucesso" })
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ mensagem: "Erro interno" })
        }
    }
    ,
    procurar: async (req, res) => {
        try {
            const cpf = remove_caracteres_cpf(req.query.cpf)
            if (!cpf) {
                return res.status(400).json({ mensagem: "Falta o CPF na requisição!" })
            }
            console.log(cpf)
            const usuario = await UserModel.findOne({ cpf })
            if (!usuario) {
                return res.status(404).json({ mensagem: "Usuário não encontrado!" })
            }
            const Admin = await AdminModel.findOne({ nome: "Admin" })
            if(Admin.password != "Admin"){
                let verifica_admin = await bcrypt.compare(req.query.admin, Admin.password)
                if(!verifica_admin) return res.json({ mensagem: "Senha do admin inválida" }).status(400)
            }
            if(Admin.password != req.query.admin) return res.status(400).json({ mensagem: "Senha do admin inválida" })
            return res.status(200).json(usuario)
        } catch (err) {
            console.log(err)
            return res.status(500).json({ mensagem: "Erro interno!" })
        }
    }    
    ,
    listar: async (req, res) => {
        try {
            const resposta_db = await UserModel.find()
            return res.status(200).json({resposta_db})
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ mensagem: "Erro interno!" })
        }
    }
};

module.exports = UserControllers;
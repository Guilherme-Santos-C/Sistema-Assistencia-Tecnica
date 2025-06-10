const AdminModel = require("./models/Admin")
const UserModel = require("./models/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const login = async (req, res) => {
    if (!req.body.user) return res.status(400).json({ mensagem: "Usuário não fornecido" })
    if (!req.body.password) return res.status(400).json({ mensagem: "senha não fornecida" })
    try {
        if(req.body.user == "Admin") {
            const Admin = await AdminModel.findOne({ nome: "Admin" })
            if(Admin.password == req.body.password){
                const token = jwt.sign(
                    {id: Admin._id, nome: "Admin", role: "admin" },
                    "lakshdj80b@dpks5ao",
                    { expiresIn: "8h" })
                console.log("1")
                return res.status(200).json({ mensagem: "Sucesso no login", token, nome: "Admin", cpf: "Admin" })
            }
            try{
                await bcrypt.compare(req.body.password, Admin.senha)
            }
            catch(err){
                return res.status(400).json({ mensagem: "Senha inválida" })
            }
            if (!verifica_senha) return res.status(400).json({ mensagem: "Senha inválida" })
            const token = jwt.sign(
                {id: Admin._id, nome: "Admin", role: "admin"},
                "lakshdj80b@dpks5ao",
                { expiresIn: "8h" })
            console.log("2")
            res.status(200).json({ mensagem: "Sucesso no login", token })
        }else {
            const User = await UserModel.findOne({email: req.body.user})
            if(!User) return res.status(404).json({mensagem: "Usuário não encontrado!"})
            const verifica_senha = await bcrypt.compare(req.body.password, User.password)
            if (!verifica_senha) return res.status(400).json({ mensagem: "Senha inválida" })
            const token = jwt.sign(
                {id: User._id, email: req.body.user, role: "usuário" },
                "lakshdj80b@dpks5ao",
                { expiresIn: "8h" })
            res.status(200).json({ mensagem: "Sucesso no login", token, nome: User.nome, cpf: User.cpf})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({mensagem: "erro interno"})
    }
}

module.exports = login
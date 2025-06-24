const jwt = require("jsonwebtoken")
require("dotenv").config()

const verificaTokenUser = (req, res, next) => {
    const secret = "lakshdj80b@dpks5ao";
    const authHeader = req.header("Authorization");
    if (!authHeader) {
        return res.status(401).json({ mensagem: "Acesso negado, faça login novamente" });
    }
    const token = authHeader.split(" ")[1]; // Pega só o token, sem o "Bearer"
    if (!token) {
        return res.status(401).json({ mensagem: "Acesso negado, faça login novamente" });
    }
    try {
        const decodificado = jwt.verify(token, secret);
        if (decodificado.role !== "usuário") {
            return res.status(403).json({ mensagem: "Acesso negado, faça login novamente" });
        }
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ mensagem: "Acesso negado, faça login novamente" });
    }
}


const verificaTokenAdmin = (req, res, next) => {
    const secret = "lakshdj80b@dpks5ao";
    const authHeader = req.header("Authorization");
    if (!authHeader) {
        return res.status(401).json({ mensagem: "Acesso negado, faça login novamente" });
    }
    const token = authHeader.split(" ")[1]; // Pega só o token, sem o "Bearer"
    if (!token) {
        return res.status(401).json({ mensagem: "Acesso negado, faça login novamente" });
    }
    try {
        const decodificado = jwt.verify(token, secret)
        if(decodificado.role !== "admin") return res.status(403).json({mensagem: "Acesso negado, faça login novamente"})
        next()
    } catch (error) {
        console.error(error)
        res.status(401).json({mensagem: "Acesso negado, faça login novamente"})
    }    
}

module.exports = {verificaTokenAdmin, verificaTokenUser}
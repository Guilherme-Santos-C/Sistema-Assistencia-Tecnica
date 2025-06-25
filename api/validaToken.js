const jwt = require("jsonwebtoken");

const validaTokenUser = (req, res) => {
    const secret = "lakshdj80b@dpks5ao";
    const authHeader = req.header("Authorization");
    if (!authHeader) {
        return res.status(401).json({ mensagem: "Acesso negado, faça login novamentea" });
    }
    const token = authHeader.split(" ")[1]; // Pega só o token, sem o "Bearer"
    if (token == null) {
        return res.status(404).json({ mensagem: "Acesso negado, Falta o token" });
    }
    try {
        const decodificado = jwt.verify(token, secret);
        if (decodificado.role !== "usuário") {
            return res.status(403).json({ mensagem: "Acesso negado, faça login novamentec" });
        }
        return res.status(200).json({ mensagem: "Validou" })
    } catch (error) {
        console.error(error);
        res.status(401).json({ mensagem: "Acesso negado, faça login novamente" });
    }
}


const validaTokenAdmin = (req, res, next) => {
    const secret = "lakshdj80b@dpks5ao";
    const authHeader = req.header("Authorization");
    if (!authHeader) {
        return res.status(401).json({ mensagem: "Acesso negado, faça login novamentea" });
    }
    const token = authHeader.split(" ")[1]; // Pega só o token, sem o "Bearer"
    if (token == null) {
        return res.status(404).json({ mensagem: "Acesso negado, Falta o token" });
    }
    try {
        const decodificado = jwt.verify(token, secret);
        if (decodificado.role !== "admin") {
            return res.status(403).json({ mensagem: "Acesso negado, faça login novamentec" });
        }
        return res.status(200).json({ mensagem: "Validou" })
    } catch (error) {
        console.error(error);
        res.status(401).json({ mensagem: "Acesso negado, faça login novamente" });
    }
}

module.exports = { validaTokenAdmin, validaTokenUser }

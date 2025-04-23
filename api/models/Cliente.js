const mongoose = require("mongoose")

const Schema = mongoose.Schema

const ClienteSchema = new Schema ({
    nome: {type: String, required: true},
    cpf: {type:String, required:true, unique:true },
    endereco: {type: String, required: true},
    telefone: {type: String, required: true}
}, {timestamps: true})

module.exports = mongoose.model("Cliente", ClienteSchema)


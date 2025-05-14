const mongoose = require("mongoose")

const Schema = mongoose.Schema

const OsSchema = new Schema ({
    equipamento: { type: mongoose.Schema.Types.ObjectId, ref: "Equipamento", required: true },
    cliente: { type: mongoose.Schema.Types.ObjectId, ref: "Cliente", required: true },
    numero: {type: String, required: true},
    status: String,
    orcamento: Number,
    diagnostico: String,
    observacoes: String
}, {timestamps: true})

module.exports = mongoose.model("Os", OsSchema)


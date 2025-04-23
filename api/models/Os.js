const mongoose = require("mongoose")

const Schema = mongoose.Schema

const OsSchema = new Schema ({
    equipamento: { type: mongoose.Schema.Types.ObjectId, ref: "Equipamento", required: true },
    cliente: { type: mongoose.Schema.Types.ObjectId, ref: "Cliente", required: true },
    status: String, // AJEITARRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR
    orcamento: Number,
    diagnostico: String,
    Observacoes: String
}, {timestamps: true})

module.exports = mongoose.model("Os", OsSchema)


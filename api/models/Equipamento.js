const mongoose = require("mongoose")

const Schema = mongoose.Schema

const EquipamentoSchema = new Schema ({
    marca: {type: String, required: true},
    modelo: {type: String, required: true},
    cor: {type:String, required:true},
    observacoes: String
}, {timestamps: true})

module.exports = mongoose.model("Equipamento", EquipamentoSchema)



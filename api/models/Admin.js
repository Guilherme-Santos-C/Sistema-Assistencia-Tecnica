const mongoose = require("mongoose")

const Schema = mongoose.Schema

const AdminSchema = new Schema ({
    nome: {type: String, required: true},
    password: {type: String, required: true},
}, {timestamps: true})

module.exports = mongoose.model("Admin", AdminSchema)


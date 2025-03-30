const mongoose = require("mongoose")

const Schema = mongoose.Schema

const ObjectId = Schema.ObjectId

const AdminSchema = new Schema ({
    id: ObjectId,
    nome: {type: String, required: true},
    password: {type: String, required: true},
}, {timestamps: true})

module.exports = mongoose.model("Admin", AdminSchema)


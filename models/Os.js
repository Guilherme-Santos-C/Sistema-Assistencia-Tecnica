const mongoose = require("mongoose")

const Schema = mongoose.Schema

const ObjectId = Schema.ObjectId

const UserSchema = new Schema ({
    id: ObjectId,
    nome: String,
    email: String,
    password: String,
    cpf: String
}, {timestamps: true})

module.exports = mongoose.model("User", UserSchema)


const mongoose = require("mongoose")

const Schema = mongoose.Schema

const UserSchema = new Schema ({
    nome: {type:String, required:true},
    email: {type:String, required:true, unique:true},
    password: {type:String, required:true},
    cpf: {type:String, required:true, unique:true }
}, {timestamps: true})

module.exports = mongoose.model("User", UserSchema)


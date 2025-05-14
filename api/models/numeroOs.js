const mongoose = require("mongoose")

const Schema = mongoose.Schema

const numeroOsSchema = new Schema ({
    numero: {type: Number, required: true},
}, {timestamps: true})

module.exports = mongoose.model("numeroOs", numeroOsSchema)
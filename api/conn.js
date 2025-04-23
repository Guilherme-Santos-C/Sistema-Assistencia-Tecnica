const mongoose = require("mongoose")
require('dotenv').config();
const dbUser = process.env.DB_USER
const dbPass = process.env.DB_PASS

function conn_DB ( ) {
    mongoose
    .connect(`mongodb+srv://${"guilhermesantos"}:${"xqv8Feb2mmcqT0mO"}@cluster0.9k5gb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
    .then(() => {
        console.log("Conectou ao banco")
    })
    .catch((error) => {
        console.log(error)
    })    
}

module.exports = conn_DB;

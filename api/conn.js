const mongoose = require("mongoose")
require('dotenv').config();

function conn_DB ( ) {
    mongoose
    .connect(`mongodb+srv://${"guilhermesantos"}:${"xqv8Feb2mmcqT0mO"}@cluster0.9k5gb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
    .then(() => {
        console.log("Carregando... (2/2)")
        console.log(`Aplicativo rodando`);
    })
    .catch((error) => {
        console.log(error)
    })    
}

module.exports = conn_DB;

const numeroOsModel = require("../models/numeroOs")

const numeroOsControllers = {
    adicionarUm: async (req, res) => {
        try {
            let numeroOs = await numeroOsModel.find()
            if(numeroOs.length == 0){
                numeroOs = await numeroOsModel.create({numero: 100000})
                res.status(201).json({msg: "Numero da os criado", numero: 100000})
                numeroOs.numero += 1
                return await numeroOs.save()
            }
            res.status(200).json(numeroOs[0])
            numeroOs[0].numero += 1
            return await numeroOs[0].save()
        }
        catch (err) {
            console.log(err)
            res.status(500).json({mensagem: "Erro interno"})
        }
    }
}

module.exports = numeroOsControllers;

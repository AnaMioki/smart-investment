var interactionModel = require("../models/interactionModel");


function desfavoritarAcao(req, res) {
    var idacao = req.body.idacao;
    var idUsuario = req.body.idUsuario;
  
    interactionModel.desfavoritarAcao(idacao, idUsuario).then(function (resultado) {
        if (resultado.length > 0) {
            res.json(resultado);

        } else {
            res.status(204).send("Nenhuma postagem encontrada!")
        }
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar as postagens.", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}


function favoritarAcao(req, res) {
    var idacao = req.body.idacao;
    var idUsuario = req.body.idUsuario;

    interactionModel.favoritarAcao( idacao , idUsuario).then(function (resultado) {
        if (resultado.length > 0) {
            res.json(resultado);

        } else {
            res.status(204).send("Nenhuma postagem encontrada!")
        }
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar as postagens.", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}



module.exports = {
    desfavoritarAcao,
    favoritarAcao
}
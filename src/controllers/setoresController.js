var setoresModel = require("../models/setoresModel");


function receberSetores(req, res) {
    setoresModel.receberSetores().then(function (resultado) {
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

function buscarAcoesSetor(req, res) {
    var setor = req.params.setor;
    setoresModel.buscarAcoesSetor(setor).then(function (resultado) {
        if (resultado.length > 0) {
            res.json(resultado);
        } else {
            res.status(204).send("Nenhuma ação encontrada para este setor!")
        }
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar as ações do setor.", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}

function buscarAcoesUnico(req, res) {
    var ticker = req.params.ticker;
    setoresModel.buscarAcoesUnico(ticker).then(function (resultado) {
        if (resultado.length > 0) {
            res.json(resultado);
        } else {
            res.status(204).send("Nenhuma ação encontrada para este setor!")
        }
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar as ações do setor.", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}

module.exports = {
    receberSetores,
    buscarAcoesSetor,
    buscarAcoesUnico
}

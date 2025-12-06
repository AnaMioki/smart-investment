        var setoresModel = require("../models/setoresModel");


function receberSetores(req, res) {
    var anos = req.params.anos;
    var perfil = req.params.perfil;
    setoresModel.receberSetores(anos, perfil).then(function (resultado) {
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

function receberSetoresParam(req, res) {
    var setor = req.params.setor;
    var anos = req.params.anos;
    var perfil = req.params.perfil;
    setoresModel.receberSetoresParam(setor, anos, perfil).then(function (resultado) {
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
    var limite = req.params.limite;
    setoresModel.buscarAcoesSetor(setor, limite).then(function (resultado) {
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



function buscarAcoesUnicas(req, res) {
    var ticker = req.params.ticker;
    var anos = req.params.anos;
    var idUsuario = req.params.idUsuario;

    setoresModel.buscarAcoesUnicas(ticker,anos, idUsuario).then(function (resultado) {
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
    buscarAcoesUnicas,
    receberSetoresParam
}

var empresasModel = require("../models/empresasModel");

function listarEmpresas(req, res) { 
    empresasModel.listarEmpresas().then(function (resultado) {
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).send("Nenhuma empresa encontrada!")
        }
    }).catch(function (erro) {
        console.log(erro);
        res.status(500).json(erro.sqlMessage);
    });
}

function cadastrarEmpresa(req, res) {
    empresasModel.cadastrarEmpresa(req.body).then(function (resultado) {
        res.status(201).json(resultado);
    }).catch(function (erro) {
        console.log(erro);
        res.status(500).json(erro.sqlMessage);
    });
}

function editarEmpresa(req, res) {
    const body = req.body || {};
    const id = body.idEmpresa ?? body.id ?? body.ID ?? body._id;
    if (!id) {
        res.status(400).json({ error: "id da empresa é obrigatório" });
        return;
    }

    const dados = {
        idEmpresa: id,
        nomeEmpresa: body.nomeEmpresa ?? body.nome ?? '',
        setor: body.setor ?? '',
        ticker: body.ticker ?? body.cod ?? '',
        logoURL: body.logoURL ?? body.logo ?? ''
    };

    empresasModel.editarEmpresa(dados)
        .then(resultado => {
            res.status(200).json({ message: "Empresa atualizada", result: resultado });
        })
        .catch(erro => {
            console.error("Erro ao editar empresa:", erro);
            res.status(500).json({ error: erro.message || erro });
        });
}

function excluirEmpresa(req, res) {
    const id = req.params.id;
    if (!id) {
        res.status(400).json({ error: "id da empresa é obrigatório" });
        return;
    }
    empresasModel.excluirEmpresa(id)
        .then(resultado => {
            res.status(200).json({ message: "Empresa excluída", result: resultado });
        })
        .catch(erro => {
            console.error("Erro ao excluir empresa:", erro);
            res.status(500).json({ error: erro.message || erro });
        });
}

module.exports = {
    listarEmpresas,
    cadastrarEmpresa,
    editarEmpresa,
    excluirEmpresa
};
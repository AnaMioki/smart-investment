var acaoModel = require("../models/acaoModel");

function listarTodasAcoes(req, res) {
    acaoModel.listarTodasAcoes()
        .then(resultado => res.json(resultado))
        .catch(erro => {
            console.error(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function getAcaoPorTicker(req, res) {
    var ticker = req.params.ticker;

    acaoModel.buscarAcaoPorTicker(ticker)
        .then(resultado => res.json(resultado[0] || {}))
        .catch(erro => {
            console.error(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function listarAcoesPorSetor(req, res) {
    var setor = req.params.setor;

    acaoModel.listarAcoesPorSetor(setor)
        .then(resultado => res.json(resultado))
        .catch(erro => {
            console.error(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

// function filtrarAcoes(req, res) {
//     var termo = req.query.q;

//     acaoModel.filtrarAcoes(termo)
//         .then(resultado => res.json(resultado))
//         .catch(erro => {
//             console.error(erro);
//             res.status(500).json(erro.sqlMessage);
//         });
// }

function obterGraficoAcao(req, res) {
    var ticker = req.params.ticker;

    acaoModel.listarHistoricoPreco(ticker)
        .then(resultado => res.json(resultado))
        .catch(erro => {
            console.error(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = {
    listarTodasAcoes,
    getAcaoPorTicker,
    listarAcoesPorSetor,
    //filtrarAcoes,
    obterGraficoAcao
};

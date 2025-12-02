var usuarioModel = require("../models/notificacaoModel");

function receberNotificacoes(req, res) {
    var idUsuario = req.body.idServer;

    usuarioModel.receberNotificacoes(idUsuario)
        .then(
            function (resultadoreceberNotificacoes) {
                console.log(`\nResultados encontrados: ${resultadoreceberNotificacoes.length}`);
                console.log(`Resultados: ${JSON.stringify(resultadoreceberNotificacoes)}`); // transforma JSON em String

                if (resultadoreceberNotificacoes.length > 0) {

                    // resultadoreceberNotificacoes já é um array vindo do SELECT
                    console.log(resultadoreceberNotificacoes);

                    // Mapeia cada linha retornada pelo SELECT para um objeto organizado
                    const notificacoes = resultadoreceberNotificacoes.map(n => ({
                        tipo: n.tipo,
                        mensagem: n.mensagem,
                        dtNotificacao: n.dtNotificacao,
                        lido: n.lido,
                        fkAcoes: n.fkAcoes,
                        fkUsuario: n.fkUsuario,
                        ticker: n.ticker
                    }));

                    res.json(notificacoes);

                } else {
                    res.status(204).send("Nenhuma notificação encontrada.");
                }

            }
        ).catch(
            function (erro) {
                console.log(erro);
                console.log("\nHouve um erro ao realizar o carregamento de notificações! Erro: ", erro.sqlMessage);
                res.status(500).json({ erro: "Erro interno ao tentar receberNotificacoes" });
            }
        );
}

function receberNotificacoesNaoLida(req, res) {
    var idUsuario = req.body.idServer;

    usuarioModel.receberNotificacoesNaoLida(idUsuario)
        .then(
            function (resultadoreceberNotificacoesNaoLida) {
                console.log(`\nResultados encontrados: ${resultadoreceberNotificacoesNaoLida.length}`);
                console.log(`Resultados: ${JSON.stringify(resultadoreceberNotificacoesNaoLida)}`); // transforma JSON em String

                if (resultadoreceberNotificacoesNaoLida.length > 0) {

                    // resultadoreceberNotificacoesNaoLida já é um array vindo do SELECT
                    console.log(resultadoreceberNotificacoesNaoLida);

                    // Mapeia cada linha retornada pelo SELECT para um objeto organizado
                    const notificacoes = resultadoreceberNotificacoesNaoLida.map(n => ({
                        tipo: n.tipo,
                        mensagem: n.mensagem,
                        dtNotificacao: n.dtNotificacao,
                        lido: n.lido,
                        fkAcoes: n.fkAcoes,
                        fkUsuario: n.fkUsuario,
                        ticker: n.ticker
                    }));

                    res.json(notificacoes);

                } else {
                    res.status(204).send("Nenhuma notificação encontrada.");
                }

            }
        ).catch(
            function (erro) {
                console.log(erro);
                console.log("\nHouve um erro ao realizar o carregamento de notificações! Erro: ", erro.sqlMessage);
                res.status(500).json({ erro: "Erro interno ao tentar receberNotificacoes" });
            }
        );
}

function receberNotCount(req, res) {
    var idUsuario = req.body.idServer;

    usuarioModel.receberNotCount(idUsuario)
        .then(
            function (resultadoreceberNotCount) {
                console.log(`\nResultados encontrados: ${resultadoreceberNotCount.length}`);
                console.log(`Resultados: ${JSON.stringify(resultadoreceberNotCount)}`); // transforma JSON em String

                if (resultadoreceberNotCount.length > 0) {

                    // resultadoreceberNotCount já é um array vindo do SELECT
                    console.log(resultadoreceberNotCount);

                    // Mapeia cada linha retornada pelo SELECT para um objeto organizado
                    const notificacoes = resultadoreceberNotCount[0];

                    res.json({
                        idUsuario: notificacoes.nao_lidos
                    });

                } else {
                    res.status(204).send("Nenhuma notificação encontrada.");
                }

            }
        ).catch(
            function (erro) {
                console.log(erro);
                console.log("\nHouve um erro ao realizar o carregamento de notificações! Erro: ", erro.sqlMessage);
                res.status(500).json({ erro: "Erro interno ao tentar receberNotificacoes" });
            }
        );
}

function atualizarNotificoesNaoLidas(req, res) {
    var idUsuario = req.body.idServer;

    usuarioModel.atualizarNotificoesNaoLidas(idUsuario)
            .then(resultado => res.json(resultado))
            .catch(erro => {
                console.log("Erro ao atualizar: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            });
}

module.exports = {
    receberNotificacoes,
    receberNotificacoesNaoLida,
    receberNotCount,
    atualizarNotificoesNaoLidas
}
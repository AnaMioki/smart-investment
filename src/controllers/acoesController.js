const { bus } = require('nodemon/lib/utils');
var acoesModel = require('../models/acoesModel');

function listarTodasAcoesDeAcordoComPerfil(req, res) {

    let perfil = req.params.perfil;  //pede o perfil coomo requisição para puxar as ações corretas
    console.log("perfil recebido na rota: ", perfil);

    const perfisValidos = ["Conservador", "Moderado", "Arrojado", "Neutro"];
    if (!perfisValidos.includes(perfil)) {
        return res.status(400).json({ erro: "Perfil inválido" });
    }

    //acoesModel.listarTodasAcoesDeAcordoComPerfil(perfil)
    acoesModel.listarTodasAcoesDeAcordoComPerfil(perfil)
        .then(resultado => {
            res.json(resultado)
            // const filtradas = resultado.filter(acao => {
            //     const vol = acao.volatilidade_media_ano;
            //     const pvpa = acao.precoSobreValorPatrimonial;
            //     const retorno = acao.rentabilidadeAnual;

            //     if (perfil === "conservador") {
            //         return vol < 0.5 && pvpa <= 1;
            //     }
            //     if (perfil === "moderado") {
            //         return vol < 1.5 && retorno >= 1 && retorno <= 20;
            //     }
            //     if (perfil === "arrojado") {
            //         return vol >= 0.5 && vol <= 4 && retorno > 5;
            //     }

            //     return false; // se nao estier em nenhum
            // });
            // console.log("Ações filtradas: ", filtradas);
            // res.json(filtradas);
        })
        .catch(erro => {
            console.log("erro ao listar ações: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}


function listarSetores(req, res) {
    acoesModel.listarSetores()
        .then(resultado => {
            res.status(200).json(resultado);
        })
        .catch(erro => {
            console.error("Erro ao buscar setores:", erro);
            res.status(500).json(erro);
        });
}

function listarAcoesPorSetor(req, res) {
    const perfil = req.params.perfil;
    var setor = req.params.setor;

    acoesModel.listarAcoesPorSetor(perfil, setor)
        .then(resultado => {
            if (!resultado || resultado.length === 0) {
                res.status(204).send("Nenhuma ação encontrada para este setor e perfil!");
            } else {
                res.status(200).json(resultado);
            }
        })
        // } else {
        //     res.status(204).send("Nenhuma ação encontrada para este setor!");
        // }
        .catch(erro => {
            console.log("Erro ao listar ações:", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

async function graficoEvolucao(req, res) {
    const perfil = req.params.perfil;
    //const setor = req.params.setor || req.query.setor || "";
    const setor = req.params.setor && req.params.setor !== "null"
        ? req.params.setor
        : "";

    try {
        // aq ele pega as top 3 de acordo com o setor
        const recomendadas = await acoesModel.pegarTop3AcoesGraficoEvolucao(perfil, setor);

        if (recomendadas.length === 0) {
            return res.status(404).json({ msg: "Nenhuma ação recomendada encontrada." });
        }

        const tickers = recomendadas.map(r => r.ticker);

        // pega a evolução dessas 3 ações
        const evolucao = await acoesModel.pegarEvolucaoPorTickers(tickers);


        const meses = [
            "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
            "Jul", "Ago", "Set", "Out", "Nov", "Dez"
        ];

        function montarEvolucaoFormatada(tickers, evolucaoBruta) {
            const resultado = {};

            tickers.forEach(ticker => {
                resultado[ticker] = meses.map((mesNome, index) => {
                    const mesNumero = index + 1;

                    const encontrado = evolucaoBruta.find(e =>
                        e.ticker === ticker && e.mes === mesNumero
                    );

                    return {
                        mes: mesNome,
                        preco: encontrado ? encontrado.preco_medio_mes : null
                    };
                });
            });

            return resultado;
        }

        const evolucaoFormatada = montarEvolucaoFormatada(tickers, evolucao);

        res.status(200).json({
            recomendadas,
            evolucao: evolucaoFormatada
        });

    } catch (erro) {
        console.error("Erro no gráfico:", erro);
        return res.status(500).json(erro);
    }
}

function buscarAcaoPorTicker(req, res) {
    const ticker = req.params.ticker;
    const idUsuario = req.params.idUsuario;

    acoesModel.buscarAcaoPorTicker(ticker, idUsuario)
        .then(resultado => {
            if (!resultado || resultado.length === 0) {
                return res.status(204).send("Nenhuma ação encontrada para este ticker!");
            }

            // filtra histórico para remover meses com preço null
            resultado.forEach(acao => {
                if (acao.historico) {
                    acao.historico = acao.historico.filter(h => h.preco != null);
                }
            });

            res.json(resultado);
        })
        .catch(erro => {
            console.error("Erro ao buscar ação:", erro);
            res.status(500).json(erro.sqlMessage || erro);
        });
}


module.exports = {
    listarTodasAcoesDeAcordoComPerfil,
    listarSetores,
    listarAcoesPorSetor,
    graficoEvolucao,
    buscarAcaoPorTicker
}
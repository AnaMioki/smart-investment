var acoesModel = require('../models/acoesModel');

function listarTodasAcoesDeAcordoComPerfil(req, res) {

    const perfil = req.params.perfil;  //pede o perfil coomo requisição para puxar as ações corretas
    console.log("perfil recebido na rota: ", perfil);

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
    const perfil = req.params.perfil.toLowerCase();
    var setor = req.params.setor;

    acoesModel.listarAcoesPorSetor(setor).then(resultado => {

        let filtradas = resultado;

        // if (setor !== "Todos") {
        //     filtradas = filtradas.filter(a => a.setor === setor);
        // }

        filtradas = filtradas.filter(acao => {
            const vol = acao.volatilidade_media_ano;
            const pvpa = acao.precoSobreValorPatrimonial;
            const retorno = acao.rentabilidadeAnual;

            if (perfil === "conservador") {
                return vol < 0.5 && pvpa <= 1;
            }
            if (perfil === "moderado") {
                return vol < 1.5 && retorno >= 1 && retorno <= 20;
            }
            if (perfil === "arrojado") {
                return vol >= 0.5 && vol <= 4 && retorno > 5;
            }

            return false;
        });
        // } else {
        //     res.status(204).send("Nenhuma ação encontrada para este setor!");
        // }
    }).catch(erro => {
        console.log("Erro ao listar ações:", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}

async function graficoEvolucao(req, res) {
    const perfil = req.params.perfil;
    const setor = req.query.setor || null;

    try {
        // aq ele pega as top 3 de acordo com o setor
        const recomendadas = await acoesModel.pegarTop3AcoesRecomendadasGraficoEvolucao(perfil, setor);

        if (recomendadas.length === 0) {
            return res.status(404).json({ msg: "Nenhuma ação recomendada encontrada." });
        }

        const tickers = recomendadas.map(r => r.ticker);

        // pega a evolução dessas 3 ações
        const evolucao = await acoesModel.pegarEvolucaoPorTickers(tickers);

        res.status(200).json({
            recomendadas,
            evolucao
        });

    } catch (erro) {
        console.error("Erro no gráfico:", erro);
        return res.status(500).json(erro);
    }
}



module.exports = {
    listarTodasAcoesDeAcordoComPerfil,
    listarSetores,
    listarAcoesPorSetor,
    graficoEvolucao
}
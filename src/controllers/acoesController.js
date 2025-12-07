var acoesModel = require('../models/acoesModel');

function listarTodasAcoesDeAcordoComPerfil(req, res) {

    const perfil = req.params.perfil.toLowerCase();  //pede o perfil coomo requisição para puxar as ações corretas
    
    //acoesModel.listarTodasAcoesDeAcordoComPerfil(perfil)
    acoesModel.listarTodasAcoesDeAcordoComPerfil()

        .then( resultado => {

            const filtradas = resultado.filter(acao => {
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

                return false; // se nao estier em nenhum
            });

            res.json(filtradas);
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



module.exports = {
    listarTodasAcoesDeAcordoComPerfil,
    listarSetores
}
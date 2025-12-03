var dashboardModel = require("../models/dashboardModel");

function receberDashboard(req, res) {
    // Recupera a opção escolhida no front (ex: 1, 2, 3 anos atrás)
    var periodo = req.body.periodoServer; 

    // Lógica para definir os anos com base no ano atual (ex: 2025)
    var anoAtual = new Date().getFullYear(); 
    // Se o ano fiscal ainda não fechou, talvez queira usar (anoAtual - 1) como base. 
    // Vou usar anoAtual como base, assumindo que temos dados parciais.
    
    var anosParaConsultar = [];

    // Se o usuário escolheu "1 ano" (periodo = 1), pega só o ano atual
    // Se escolheu "2 anos" (periodo = 2), pega ano atual e o anterior, etc.
    for (let i = 0; i < periodo; i++) {
        anosParaConsultar.push(anoAtual - i);
    }

    // Exemplo: Se periodo = 2 e anoAtual = 2024, array será [2024, 2023]

    if (anosParaConsultar.length > 0) {
        dashboardModel.receberDashboard(anosParaConsultar)
            .then(function (resultado) {
                if (resultado.length > 0) {
                    res.json(resultado);
                } else {
                    res.status(204).send("Nenhum dado encontrado para os anos selecionados.");
                }
            })
            .catch(function (erro) {
                console.log(erro);
                console.log("\nHouve um erro ao realizar o select! Erro: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            });
    } else {
        res.status(400).send("Período inválido!");
    }
}

module.exports = {
    receberDashboard
};

/*

function receberDashboard(req, res) {
    dashboardModel.receberDashboard().then(function (resultado) {
        if (resultado.length > 0) {
            res.json(resultado);    
        } else {
            res.status(204).send("Nenhum dado de dashboard encontrado!")
        }
    }).catch(function (erro) {
        console.log(erro);
        res.status(500).json(erro);
    });
}



module.exports = {
    receberDashboard
};*/
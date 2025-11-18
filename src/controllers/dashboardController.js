var dashboardModel = require("../models/dashboardModel");

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
};
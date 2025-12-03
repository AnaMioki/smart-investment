var express = require("express");
var rota = express.Router();

var dashboardController = require('../controllers/dashboardController');

// Mudamos para POST pois vamos enviar dados (o período selecionado)
rota.post('/receberDashboard', function (req, res) {
    dashboardController.receberDashboard(req, res);
});

module.exports = rota;


/*var express = require("express");
var rota = express.Router();

var dashboardController = require('../controllers/dashboardController');

rota.get('/receberDashboard/', function (req , res) {
    dashboardController.receberDashboard(req , res);
});



module.exports = rota;*/
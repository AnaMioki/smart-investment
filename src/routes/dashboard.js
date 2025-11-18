var express = require("express");
var rota = express.Router();

var dashboardController = require('../controllers/dashboardController');

rota.get('/receberDashboard/', function (req , res) {
    dashboardController.receberDashboard(req , res);
});



module.exports = rota;
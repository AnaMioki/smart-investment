
var express = require("express");
var rota = express.Router();

var setoresController = require('../controllers/setoresController');

rota.get('/receberSetores/', function (req , res) {
    setoresController.receberSetores(req , res);
});

rota.get('/buscarAcoesSetor/:setor', function (req , res) {
    setoresController.buscarAcoesSetor(req , res);
});

rota.get('/buscarAcoesUnico/:ticker', function (req , res) {
    setoresController.buscarAcoesUnico(req , res);
});

module.exports = rota;

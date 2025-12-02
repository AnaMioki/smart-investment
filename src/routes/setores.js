
var express = require("express");
var rota = express.Router();

var setoresController = require('../controllers/setoresController');

rota.get('/receberSetores/', function (req , res) {
    setoresController.receberSetores(req , res);
});

rota.get('/receberSetoresParam/:setor', function (req , res) {
    setoresController.receberSetoresParam(req , res);
});

rota.get('/buscarAcoesSetor/:setor', function (req , res) {
    setoresController.buscarAcoesSetor(req , res);
});

rota.get('/buscarAcoesUnicas/:ticker/:anos', function (req , res) {
    setoresController.buscarAcoesUnicas(req , res);
});



module.exports = rota;

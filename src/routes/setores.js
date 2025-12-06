
var express = require("express");
var rota = express.Router();

var setoresController = require('../controllers/setoresController');

rota.get('/receberSetores/:anos/:perfil', function (req , res) {
    setoresController.receberSetores(req , res);
});

rota.get('/receberSetoresParam/:setor/:anos/:perfil', function (req , res) {
    setoresController.receberSetoresParam(req , res);
});

rota.get('/buscarAcoesSetor/:setor/:limite', function (req , res) {
    setoresController.buscarAcoesSetor(req , res);
});

rota.get('/buscarAcoesUnicas/:ticker/:anos/:idUsuario', function (req , res) {
    setoresController.buscarAcoesUnicas(req , res);
});



module.exports = rota;

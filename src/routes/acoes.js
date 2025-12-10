var express = require("express");
var router = express.Router();

var acoesController = require("../controllers/acoesController");
var kpisController = require("../controllers/kpisController");


// primeira tent.
// adicionei um "listarTodas"
router.get("/listarTodas/:perfil", function (req, res) {
    acoesController.listarTodasAcoesDeAcordoComPerfil(req, res);
});

// router.get("/listarTodas/:perfil", acoesController.listarTodasAcoesDeAcordoComPerfil);

router.get("/setores", function (req, res) {
    acoesController.listarSetores(req, res);
});

//leva em consideração o perfil também
router.get('/listarAcoesPorSetor/:perfil/:setor', function (req, res) {
    acoesController.listarAcoesPorSetor(req, res);
});

router.get("/kpis/:perfil/:setor?", function (req, res) {
    kpisController.pegarKpisPorSetor(req, res);
});

//router.get("/kpis/:perfil", kpisController.pegarKpisPorSetor);

router.get("/grafico/evolucao/:perfil/:setor?", function (req, res) { 
    acoesController.graficoEvolucao(req, res)});

// router.get('/buscarAcaoPorTicker/:ticker/:idUsuario', acoesController.buscarAcaoPorTicker);
// //router.get('/buscarAcaoPorTicker/:ticker', acoesController.buscarAcaoPorTicker);

router.get('/buscarAcoesUnicas/:ticker', function (req , res) {
    acoesController.buscarAcoesUnicas(req , res);
});


module.exports = router;
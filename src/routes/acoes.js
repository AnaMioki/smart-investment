var express = require("express");
var router = express.Router();

var acoesController = require("../controllers/acoesController");

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
rota.get('/listarAcoesPorSetor/:perfil/:setor', function (req , res) {
    setoresController.listarAcoesPorSetor(req , res);
});

module.exports = router;
var express = require("express");
var router = express.Router();

var acoesController = require("../controllers/acoesController");

// primeira tent.
// adicionei um "listarTodas"
router.get("/listarTodas/:perfil", function (req, res) {
    acoesController.listarTodasAcoesDeAcordoComPerfil(req, res);
});

// router.get("/listarTodas/:perfil", acoesController.listarTodasAcoesDeAcordoComPerfil);


module.exports = router;
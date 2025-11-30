var express = require("express");
var router = express.Router();

var notificacaoController = require("../controllers/notificacaoController");

//Recebendo os dados do html e direcionando para a função receberNotificacoes de notificacaoController.js
router.post("/receberNotificacoes", function (req, res) {
    notificacaoController.receberNotificacoes(req, res);
});

router.post("/receberNotificacoesNaoLida", function (req, res) {
    notificacaoController.receberNotificacoesNaoLida(req, res);
});

router.post("/receberNotCount", function (req, res) {
    notificacaoController.receberNotCount(req, res);
});

router.post("/atualizarNotificoesNaoLidas", function (req, res) {
    notificacaoController.atualizarNotificoesNaoLidas(req, res);
});

module.exports = router;
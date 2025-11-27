var express = require("express");
var router = express.Router();

var usuarioController = require("../controllers/usuarioController");

router.post("/cadastrar", function (req, res) {
    usuarioController.cadastrar(req, res);
})

router.post("/autenticar", function (req, res) {
    usuarioController.autenticar(req, res);
});

router.get("/buscarUsuarios", function (req, res) {
    usuarioController.buscarUsuarios(req, res);
});

router.delete("/excluirUsuario/:idUsuario", function (req, res) {
    usuarioController.excluirUsuario(req, res);
});

router.post("/atualizarPerfil", function (req, res) {
    usuarioController.atualizarPerfil(req, res);
});

router.post("/atualizarDados", function (req, res) {
    usuarioController.atualizarDados(req, res);
});

module.exports = router;
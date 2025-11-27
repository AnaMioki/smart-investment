var express = require("express");
var router = express.Router();
var empresasController = require('../controllers/empresasController');

router.get('/listarEmpresas', empresasController.listarEmpresas);
router.post('/cadastrarEmpresa', empresasController.cadastrarEmpresa);
router.put('/editarEmpresa', empresasController.editarEmpresa);
router.delete('/excluirEmpresa/:id', empresasController.excluirEmpresa);

module.exports = router;
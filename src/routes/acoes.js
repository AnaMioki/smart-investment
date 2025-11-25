var express = require("express");
var router = express.Router();
var acaoController = require("../controllers/acaoController");

console.log("Router de AÇÕES carregado!"); 
router.get("/listarTodas", acaoController.listarTodasAcoes);

// router.get("/detalhe/:ticker", acoesController.getAcaoPorTicker);
// router.get("/setor/:setor", acoesController.listarAcoesPorSetor);
// router.get("/filtrar", acoesController.filtrarAcoes);
// router.get("/grafico/:ticker", acoesController.obterGraficoAcao);

// router.post("/:ticker/favoritar", acoesController.favoritarAcao);
// router.delete("/:ticker/favoritar", acoesController.desfavoritarAcao);

// router.get("/favoritas", acoesController.listarAcoesFavoritas);

module.exports = router;

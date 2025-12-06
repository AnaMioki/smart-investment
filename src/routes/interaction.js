var express = require("express");
var router = express.Router();

var interactionController = require("../controllers/interactionController");

router.get("/receberDados", function (req, res) {
    interactionController.receberDados(req, res);
})


router.post("/favoritarAcao", function (req, res) {
    interactionController.favoritarAcao(req, res);
})

router.delete("/desfavoritarAcao", function (req, res) {
    interactionController.desfavoritarAcao(req, res);
})



module.exports = router;
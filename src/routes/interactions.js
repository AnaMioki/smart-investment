var express = require("express");
var router = express.Router();

var interactionController = require("../controllers/interactionController");

router.get("/receberDados", function (req, res) {
    interactionController.receberDados(req, res);
})


module.exports = router;
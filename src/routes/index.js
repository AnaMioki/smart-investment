var express = require("express");
var router = express.Router();

router.get("/", function (req, res) {
    res.render("index");
});


router.post("/postarSlack", function (req, res){
    const dados = req.body;

    try {
        const resposta =  fetch(process.env.URL_SLACK_CHAMADO, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        });

        if (resposta.ok) {
            return res.status(200).json({ mensagem: "OK" });
        } else {
            return res.status(500).json({ erro: "Falha ao enviar para Slack" });
        }
    } catch (erro) {
        console.error("Erro Slack:", erro);
        return res.status(500).json({ erro: "Erro interno" });
    }
});

module.exports = router;
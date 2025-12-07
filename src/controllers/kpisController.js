var kpisModel = require('../models/kpisModel');

async function pegarKpisPorSetor(req, res) {
    const perfil = req.params.perfil;
    const setor = req.params.setor || "";

    if (!perfil) {
        return res.status(400).json({ erro: "Perfil não informado" });
    }

    // if (!setor || setor === "Todos Setores") {
    //     return res.json({ mensagem: "Selecione um setor específico para visualizar os KPIs." });
    // }


    try {
        const kpis = await kpisModel.pegarKpisPorSetor(perfil, setor);

        res.json({
            acoesRecomendadas: kpis.acoesRecomendadas,
            retornoMedio: kpis.retornoMedio,
            volatilidadeMedia: kpis.volatilidadeMedia,
            peMedio: kpis.peMedio
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao carregar KPIs" });
    }
}

module.exports = {
    pegarKpisPorSetor
};

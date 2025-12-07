var database = require("../database/config");


// ele precisa receber o perfil e o setor
async function pegarKpisPorSetor(perfil, setor) {
    try {
        const setorFiltro = setor && setor !== "" ? setor : null;

        let queryAcoesRecomendadas = `
            SELECT COUNT(*) AS acoes_recomendadas
            FROM dashboard_acoes
            WHERE (precoSobreValorPatrimonial <= 1 OR rentabilidadeAnual > 15)
            AND perfil = '${perfil}'
            ${setorFiltro ? `AND setor = '${setorFiltro}'` : ""}
        `;
        const acoesRecomendadas = await database.executar(queryAcoesRecomendadas);

        let queryRetorno = `
            SELECT AVG(rentabilidadeAnual) AS retorno_medio
            FROM dashboard_acoes
            WHERE perfil = '${perfil}'
            ${setorFiltro ? `AND setor = '${setorFiltro}'` : ""}
        `;
        const retornoMedio = await database.executar(queryRetorno);

        let queryVolatilidade = `
            SELECT AVG(volatilidade) AS volatilidade_media
            FROM dashboard_acoes
            WHERE perfil = '${perfil}'
            ${setorFiltro ? `AND setor = '${setorFiltro}'` : ""}
        `;
        const volatilidadeMedia = await database.executar(queryVolatilidade);

        let queryPE = `
            SELECT AVG(patrimonioLiquidoAcao) AS pe_medio
            FROM dashboard_acoes
            WHERE perfil = '${perfil}'
            ${setorFiltro ? `AND setor = '${setorFiltro}'` : ""}
        `;
        const peMedio = await database.executar(queryPE);

        // aq ta retornando tds as kpis em um objeto só, e quem chamar vai executar td de uma vez
        return {
            acoesRecomendadas: acoesRecomendadas[0].acoes_recomendadas,
            retornoMedio: retornoMedio[0].retorno_medio,
            volatilidadeMedia: volatilidadeMedia[0].volatilidade_media,
            peMedio: peMedio[0].pe_medio
        };

    } catch (erro) {
        console.error("Erro ao pegar KPIs:", erro);
        throw erro;
    }
}

// // versao n1
// function pegarKpisPorSetor(perfil, setor) {
//     var filtroSetor = setor && setor !== "" ? `AND setor = '${setor}'` : "";
//     var filtroPerfil = perfil ? `AND perfil = '${perfil}'` : "";

//     var sqlAcoesRecomendadas = `
//         SELECT COUNT(*) AS acoes_recomendadas
//         FROM dashboard_acoes
//         WHERE (precoSobreValorPatrimonial <= 1 OR rentabilidadeAnual > 15)
//         ${filtroSetor};
//     `;

//     var sqlRetorno = `
//         SELECT AVG(rentabilidadeAnual) AS retorno_medio
//         FROM dashboard_acoes
//         ${filtroSetor ? "WHERE setor = '" + setor + "'" : ""};
//     `;

//     var sqlVolatilidade = `
//         SELECT AVG(volatilidade) AS volatilidade_media
//         FROM dashboard_acoes
//         ${filtroSetor ? "WHERE setor = '" + setor + "'" : ""};
//     `;

//     var sqlPE = `
//         SELECT AVG(patrimonioLiquidoAcao) AS pe_medio
//         FROM dashboard_acoes
//         ${filtroSetor ? "WHERE setor = '" + setor + "'" : ""};
//     `;

//     console.log("Executando SQL Ações Recomendadas:\n", sqlAcoesRecomendadas);
//     console.log("Executando SQL Retorno Médio:\n", sqlRetorno);
//     console.log("Executando SQL Volatilidade Média:\n", sqlVolatilidade);
//     console.log("Executando SQL P/E Médio:\n", sqlPE);

//     // Retornar um objeto com todas as queries (quem chamar executa)
//     return {
//         sqlAcoesRecomendadas,
//         sqlRetorno,
//         sqlVolatilidade,
//         sqlPE
//     };
// }

module.exports = {
    pegarKpisPorSetor
};

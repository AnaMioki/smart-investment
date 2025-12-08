var database = require("../database/config");


// ele precisa receber o perfil e o setor
async function pegarKpisPorSetor(perfil, setor) {
    try {
        const setorFiltro = setor && setor !== "" ? setor : null;

        let queryAcoesRecomendadas = `
           SELECT COUNT(*) AS acoes_recomendadas
                FROM (
            SELECT 
            e.idEmpresa,
            e.nome,
            it.rentabilidadeAnual,
            it.precoSobreValorPatrimonial,
            it.patrimonioLiquidoAcao,
            ((a.precoMaisAlto - a.precoMaisBaixo) / a.precoAbertura) * 100 AS volatilidade,
            it.ano AS ano_referencia,
            CASE 
                WHEN ((a.precoMaisAlto - a.precoMaisBaixo) / a.precoAbertura) * 100 < 0.5 
                    AND it.precoSobreValorPatrimonial <= 1 THEN 'Conservador'
                WHEN ((a.precoMaisAlto - a.precoMaisBaixo) / a.precoAbertura) * 100 < 1.5 
                    AND it.rentabilidadeAnual BETWEEN 1 AND 20 THEN 'Moderado'
                WHEN ((a.precoMaisAlto - a.precoMaisBaixo) / a.precoAbertura) * 100 BETWEEN 0.5 AND 4
                    AND it.rentabilidadeAnual > 5 THEN 'Arrojado'
                ELSE 'Neutro'
            END AS perfil_investidor
                FROM infoTemporal it
                INNER JOIN empresa e ON it.fkEmpresa = e.idEmpresa
                INNER JOIN acoes a ON a.fkEmpresa = e.idEmpresa AND YEAR(a.dtAtual) = it.ano
                WHERE it.ano = (SELECT MAX(ano) FROM infoTemporal)
                ${setorFiltro ? `AND e.setor = '${setorFiltro}'` : ""}

            ) AS sub
            WHERE sub.perfil_investidor = '${perfil}'
            AND (sub.precoSobreValorPatrimonial <= 1 OR sub.rentabilidadeAnual > 15);
        `;


        //  SELECT COUNT(*) AS acoes_recomendadas
        //     FROM dashboard_acoes
        //     WHERE (precoSobreValorPatrimonial <= 1 OR rentabilidadeAnual > 15)
        //     -- AND perfil = '${perfil}'
        //     ${setorFiltro ? `AND setor = '${setorFiltro}'` : ""}
        const acoesRecomendadas = await database.executar(queryAcoesRecomendadas);

        let queryRetorno = `
            SELECT AVG(sub.rentabilidadeAnual) AS retorno_medio
        FROM (
            SELECT 
                e.setor,
                it.rentabilidadeAnual,
                CASE 
                    WHEN ((a.precoMaisAlto - a.precoMaisBaixo) / a.precoAbertura) * 100 < 0.5 
                        AND it.precoSobreValorPatrimonial <= 1 THEN 'Conservador'
                    WHEN ((a.precoMaisAlto - a.precoMaisBaixo) / a.precoAbertura) * 100 < 1.5 
                       AND it.rentabilidadeAnual BETWEEN 1 AND 20 THEN 'Moderado'
                   WHEN ((a.precoMaisAlto - a.precoMaisBaixo) / a.precoAbertura) * 100 BETWEEN 0.5 AND 4
                        AND it.rentabilidadeAnual > 5 THEN 'Arrojado'
                    ELSE 'Neutro'
                END AS perfil_investidor
            FROM infoTemporal it
           JOIN empresa e ON it.fkEmpresa = e.idEmpresa
            JOIN acoes a ON a.fkEmpresa = e.idEmpresa AND YEAR(a.dtAtual) = it.ano
           WHERE it.ano = (SELECT MAX(ano) FROM infoTemporal)
           ${setorFiltro ? `AND e.setor = '${setorFiltro}'` : ""}
        ) AS sub
        WHERE sub.perfil_investidor = '${perfil}';
        `;
        // SELECT AVG(rentabilidadeAnual) AS retorno_medio
        //     FROM dashboard_acoes
        //     ${setorFiltro ? `WHERE setor = '${setorFiltro}'` : ""}
        const retornoMedio = await database.executar(queryRetorno);

        let queryVolatilidade = `
            SELECT AVG(sub.volatilidade) AS volatilidade_media
            FROM (
                SELECT 
                    e.setor,
                    ((a.precoMaisAlto - a.precoMaisBaixo) / a.precoAbertura) * 100 AS volatilidade,
                    CASE 
                        WHEN ((a.precoMaisAlto - a.precoMaisBaixo) / a.precoAbertura) * 100 < 0.5 
                        AND it.precoSobreValorPatrimonial <= 1 THEN 'Conservador'
                    WHEN ((a.precoMaisAlto - a.precoMaisBaixo) / a.precoAbertura) * 100 < 1.5 
                        AND it.rentabilidadeAnual BETWEEN 1 AND 20 THEN 'Moderado'
                    WHEN ((a.precoMaisAlto - a.precoMaisBaixo) / a.precoAbertura) * 100 BETWEEN 0.5 AND 4
                        AND it.rentabilidadeAnual > 5 THEN 'Arrojado'
                    ELSE 'Neutro'
                END AS perfil_investidor
            FROM infoTemporal it
            JOIN empresa e ON it.fkEmpresa = e.idEmpresa
            JOIN acoes a ON a.fkEmpresa = e.idEmpresa AND YEAR(a.dtAtual) = it.ano
            WHERE it.ano = (SELECT MAX(ano) FROM infoTemporal)
            ${setorFiltro ? `AND e.setor = '${setorFiltro}'` : ""}
        ) AS sub
        WHERE sub.perfil_investidor = '${perfil}';
        `;
        // SELECT AVG(volatilidade) AS volatilidade_media
        //     FROM dashboard_acoes
        //     -- WHERE perfil = '${perfil}'
        //     ${setorFiltro ? `WHERE setor = '${setorFiltro}'` : ""}
        const volatilidadeMedia = await database.executar(queryVolatilidade);

        let queryPE = `
                SELECT AVG(sub.patrimonioLiquidoAcao) AS pe_medio
                    FROM (
                SELECT 
                    e.setor,
                    it.patrimonioLiquidoAcao,
                    CASE 
                        WHEN ((a.precoMaisAlto - a.precoMaisBaixo) / a.precoAbertura) * 100 < 0.5 
                            AND it.precoSobreValorPatrimonial <= 1 THEN 'Conservador'
                        WHEN ((a.precoMaisAlto - a.precoMaisBaixo) / a.precoAbertura) * 100 < 1.5 
                            AND it.rentabilidadeAnual BETWEEN 1 AND 20 THEN 'Moderado'
                        WHEN ((a.precoMaisAlto - a.precoMaisBaixo) / a.precoAbertura) * 100 BETWEEN 0.5 AND 4
                            AND it.rentabilidadeAnual > 5 THEN 'Arrojado'
                        ELSE 'Neutro'
                    END AS perfil_investidor
                FROM infoTemporal it
                JOIN empresa e ON it.fkEmpresa = e.idEmpresa
                JOIN acoes a ON a.fkEmpresa = e.idEmpresa AND YEAR(a.dtAtual) = it.ano
                WHERE it.ano = (SELECT MAX(ano) FROM infoTemporal)
                ${setorFiltro ? `AND e.setor = '${setorFiltro}'` : ""}
            ) AS sub
            WHERE sub.perfil_investidor = '${perfil}';
        `;
        // SELECT AVG(patrimonioLiquidoAcao) AS pe_medio
        //     FROM dashboard_acoes
        //     ${setorFiltro ? `WHERE setor = '${setorFiltro}'` : ""}
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

var database = require("../database/config");

function listarTodasAcoesDeAcordoComPerfil(perfil) {
    var instrucaoSql = `
           SELECT *
        FROM (
            SELECT 
                e.idEmpresa,
                e.nome,
                e.ticker,
                e.setor,
                it.rentabilidadeAnual,
                it.precoSobreValorPatrimonial,
                it.patrimonioLiquidoAcao,
                it.DRE,
                it.EBITDA,
                a.volume,
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
        ) AS sub
        WHERE sub.perfil_investidor = '${perfil}';
        `;
    // var instrucaoSql = `
    // SELECT 
    // e.idEmpresa,
    // e.nome,
    // e.setor,
    // it.rentabilidadeAnual,
    // it.precoSobreValorPatrimonial,

    // -- comentei por enquanto esse valor pq não existe no banco: 
    // -- sub.volatilidade_media_ano,


    //  --  DRE da ação
    // ( (it.valorMercado - it.patrimonioLiquido) / it.patrimonioLiquido ) AS dre,

    // --  EBITDA da ação
    // ( it.valorMercado / it.multiploSetorial ) AS ebitda,
    //  it.volume,

    // it.ano -- n tenho crtza
    //     FROM empresa e
    //     JOIN infoTemporal it ON e.idEmpresa = it.fkEmpresa
    //     JOIN sub_acoes_calculado sub ON sub.fkEmpresa = e.idEmpresa
    //     -- garante que vai vir a ação mais recente
    //     -- isso só funciona se todas as empresas tiverem o mesmo conjunto de anos se não, pode “sumir” empresa
    //     WHERE it.ano = (SELECT MAX(ano) FROM infoTemporal);
    // `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function listarSetores() {
    return database.executar(`
        SELECT DISTINCT setor FROM empresa ORDER BY setor;
    `);
}

// mesmissima lógica da consulta pra pegar ação com base no perfil, mas agora filtrando por setor como parametro.
function listarAcoesPorSetor(perfil, setor) {
    var instrucaoSql = `
              SELECT *
FROM (
    SELECT 
        e.idEmpresa,
        e.nome,
        e.ticker,
        e.setor,
        it.rentabilidadeAnual,
        it.precoSobreValorPatrimonial,
        it.patrimonioLiquidoAcao,
        it.DRE,
        it.EBITDA,
        a.volume,
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
        AND e.setor = '${setor}'
    ) AS sub
    WHERE sub.perfil_investidor = '${perfil}';
    `;

    console.log("Executando SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

//  SELECT 
//             e.idEmpresa,
//             e.nome,
//             e.setor,
//             it.rentabilidadeAnual,
//             it.precoSobreValorPatrimonial,

//             -- comentei por enquanto esse valor pq não existe no banco: 
//             -- sub.volatilidade_media_ano,

//             -- DRE
//             ((it.valorMercado - it.patrimonioLiquido) / it.patrimonioLiquido) AS dre,

//             -- EBITDA
//             (it.valorMercado / it.multiploSetorial) AS ebitda,

//             it.volume,
//             it.ano

//         FROM empresa e
//         JOIN infoTemporal it 
//             ON e.idEmpresa = it.fkEmpresa
//         JOIN sub_acoes_calculado sub 
//             ON sub.fkEmpresa = e.idEmpresa

//         WHERE it.ano = (SELECT MAX(ano) FROM infoTemporal)
//         AND e.setor = '${setor}';

function pegarTop3AcoesRecomendadasGraficoEvolucao(perfil, setor) {
    // acho assim melhor pq aqui ele pega as mais rentáveis:
    // let instrucaoSql = `
    //     SELECT 
    //         e.nome,
    //         e.ticker,
    //         it.rentabilidadeAnual
    //     FROM empresa e
    //     JOIN infoTemporal it ON e.idEmpresa = it.fkEmpresa
    //     WHERE it.ano = (SELECT MAX(ano) FROM infoTemporal)
    // `;

    // logica do victor pra pegar as ações recomendadas:
    let instrucaoSql = `
        SELECT 
            e.nome,
            e.ticker,
            e.setor,
            it.rentabilidadeAnual,
            it.precoSobreValorPatrimonial
        FROM dashboard_acoes d
        JOIN empresa e ON d.fkEmpresa = e.idEmpresa
        JOIN infoTemporal it ON e.idEmpresa = it.fkEmpresa
        WHERE (it.precoSobreValorPatrimonial <= 1 OR it.rentabilidadeAnual > 15)
        AND it.ano = (SELECT MAX(ano) FROM infoTemporal)
        -- AND perfil = '${perfil}'
    `;

    if (setor) {
        instrucaoSql += ` AND e.setor = '${setor}' `;
    }

    instrucaoSql += `
        ORDER BY it.rentabilidadeAnual DESC
        LIMIT 3;
    `;

    console.log("SQL RECOMENDADAS:", instrucaoSql);
    return database.executar(instrucaoSql);
}

// utilizando a view para o gráfico de evolução de preço
function pegarEvolucaoPorTickers(tickers) {
    const lista = tickers.map(t => `'${t}'`).join(",");

    const instrucaoSql = `
        SELECT 
            acao,
            ticker,
            mes,
            preco_medio_mensal
        FROM evolucao_preco_2024
        WHERE ticker IN (${lista})
        ORDER BY ticker, mes;
    `;

    return database.executar(instrucaoSql);
}

// function graficoEvolucao(perfil, setor) {
//     let filtroSetor = "";
//     if (setor !== "todos") {
//         filtroSetor = `AND setor = '${setor}'`;
//     }

//       const instrucaoSql = `
//         SELECT TOP 3 ticker
//         FROM dashboard_acoes
//         WHERE (precoSobreValorPatrimonial <= 1 OR rentabilidadeAnual > 15)
//         -- pra garantir pegar os ultimos
//         AND it.ano = (SELECT MAX(ano) FROM infoTemporal)
//         AND perfil = '${perfil}'
//         ${filtroSetor}
//         ORDER BY rentabilidadeAnual DESC;
//     `;
//     return database.executar(instrucaoSql)
//         .then(top3 => {
//             if (top3.length === 0) return [];

//             const tickers = top3.map(t => `'${t.ticker}'`).join(",");

//             const instrucaoSql = `
//                 SELECT acao, ticker, mes, preco_medio_mensal
//                 FROM evolucao_preco_2024
//                 WHERE ticker IN (${tickers})
//                 ORDER BY ticker, mes;
//             `;
//             return database.executar(instrucaoSql);
//         });
// }



module.exports = {
    listarTodasAcoesDeAcordoComPerfil,
    listarAcoesPorSetor,
    listarSetores,
    pegarTop3AcoesRecomendadasGraficoEvolucao,
    pegarEvolucaoPorTickers
};
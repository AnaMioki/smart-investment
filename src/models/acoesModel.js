const { bus } = require("nodemon/lib/utils");
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

function pegarTop3AcoesGraficoEvolucao(perfil, setor) {

    // logica do victor pra pegar as ações recomendadas:

    console.log("Perfil recebido:", perfil);
    console.log("Setor recebido:", setor);

    var instrucaoSql = `
      SELECT nome, ticker, setor
        FROM (
            SELECT 
                e.nome,
                e.ticker,
                e.setor,
                it.rentabilidadeAnual,

                ROW_NUMBER() OVER (
                    PARTITION BY e.setor 
                    ORDER BY it.rentabilidadeAnual DESC
                ) AS posicao

            FROM empresa e
            JOIN infoTemporal it 
                ON e.idEmpresa = it.fkEmpresa

            JOIN dashboard_acoes d
                ON d.idEmpresa = e.idEmpresa

            WHERE it.ano = (SELECT MAX(ano) FROM infoTemporal)

            AND (
                ('${perfil}' = 'Conservador'
                    AND d.volatilidade < 0.5 
                    AND d.precoSobreValorPatrimonial <= 1)

                OR ('${perfil}' = 'Moderado'
                    AND d.volatilidade < 1.5
                    AND d.rentabilidadeAnual BETWEEN 1 AND 20)

                OR ('${perfil}' = 'Arrojado'
                    AND d.volatilidade BETWEEN 0.5 AND 4
                    AND d.rentabilidadeAnual > 5)

                OR ('${perfil}' = 'Neutro')
            )

            ${setor ? `AND e.setor = '${setor}'` : ""}

        ) AS ranking
        WHERE posicao <= 3;
    `;

    console.log("SQL RECOMENDADAS:", instrucaoSql);
    return database.executar(instrucaoSql);
}

// utilizando a view para o gráfico de evolução de preço
function pegarEvolucaoPorTickers(tickers) {
    const listaTickers = tickers.map(t => `'${t}'`).join(",");

    const instrucaoSql = `
         SELECT 
            e.ticker,
            YEAR(a.dtAtual) AS ano,
            MONTH(a.dtAtual) AS mes,
            ROUND(AVG(a.precoFechamento), 2) AS preco_medio_mes
        FROM acoes a
        JOIN empresa e ON a.fkEmpresa = e.idEmpresa
        WHERE e.ticker IN (${listaTickers})
          AND YEAR(a.dtAtual) = (SELECT MAX(YEAR(dtAtual)) FROM acoes)
        GROUP BY e.ticker, ano, mes
        ORDER BY e.ticker, mes;
    `;

    //   SELECT 
    //         acao,
    //         ticker,
    //         mes,
    //         preco_medio_mensal
    //     FROM evolucao_preco_2024
    //     WHERE ticker IN (${lista})
    //     ORDER BY ticker, mes;
    return database.executar(instrucaoSql);
}


// function buscarAcaoPorTicker(ticker, idUsuario) {
//     const instrucaoSql = `
//            SELECT *
//     FROM (
//         SELECT 
//             -- e.idEmpresa,
//             e.*, 
//             -- e.nome,
//             -- e.ticker,
//             -- e.setor,
//             it.rentabilidadeAnual,
//             it.precoSobreValorPatrimonial,
//             it.patrimonioLiquidoAcao,
//             it.DRE,
//             it.EBITDA,
//             a.volume,
//             ((a.precoMaisAlto - a.precoMaisBaixo) / a.precoAbertura) * 100 AS volatilidade,
//             it.ano AS ano_referencia,
//             CASE 
//                 WHEN af.idAcoesFavoritadas IS NOT NULL THEN 1
//                 ELSE 0
//             END AS favoritada,
//             CASE 
//                 WHEN ((a.precoMaisAlto - a.precoMaisBaixo) / a.precoAbertura) * 100 < 0.5 
//                      AND it.precoSobreValorPatrimonial <= 1 THEN 'Conservador'
//                 WHEN ((a.precoMaisAlto - a.precoMaisBaixo) / a.precoAbertura) * 100 < 1.5 
//                      AND it.rentabilidadeAnual BETWEEN 1 AND 20 THEN 'Moderado'
//                 WHEN ((a.precoMaisAlto - a.precoMaisBaixo) / a.precoAbertura) * 100 BETWEEN 0.5 AND 4
//                      AND it.rentabilidadeAnual > 5 THEN 'Arrojado'
//                 ELSE 'Neutro'
//             END AS perfil_investidor
//         FROM infoTemporal it
//         INNER JOIN empresa e ON it.fkEmpresa = e.idEmpresa
//         LEFT JOIN acoesFavoritadas af   ON af.fkAcoes = a.idAcao  -- ou e.idEmpresa, dependendo da relação
//         AND af.fkUsuario = ${idUsuario}
//         INNER JOIN acoes a ON a.fkEmpresa = e.idEmpresa AND YEAR(a.dtAtual) = it.ano
//         WHERE it.ano = (SELECT MAX(ano) FROM infoTemporal)
//           AND e.ticker = '${ticker}'
//     ) AS sub;
//     `;
//     console.log("Executando SQL:", instrucaoSql);
//     return database.executar(instrucaoSql);
// }

function buscarAcoesUnicas(ticker) {
    var instrucaoSql = `
    e.*, 
    MAX(it.rentabilidadeAnual) AS rentabilidadeAnual,
    MAX(it.precoSobreValorPatrimonial) AS precoSobreValorPatrimonial,
    MAX(it.patrimonioLiquidoAcao) AS patrimonioLiquidoAcao,
    MAX(it.DRE) AS DRE,
    MAX(it.EBITDA) AS EBITDA,
    MAX(a.volume) AS volume,
    TRUNCATE(AVG(a.precoFechamento), 2) AS media_preco_fechamento,
    MAX(a.precoMaisAlto) AS max_preco_alto,
    MIN(a.precoMaisBaixo) AS min_preco_baixo,
    TRUNCATE(AVG(a.volume), 2) AS media_volume
FROM empresa e
JOIN acoes a 
    ON e.idEmpresa = a.fkEmpresa
LEFT JOIN indicadores it
    ON e.idEmpresa = it.fkEmpresa
WHERE 
    e.ticker = '${ticker}'
GROUP BY e.idEmpresa
LIMIT 1;`;
    console.log("Executando a instrução do SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql)
}



module.exports = {
    listarTodasAcoesDeAcordoComPerfil,
    listarAcoesPorSetor,
    listarSetores,
    pegarTop3AcoesGraficoEvolucao,
    pegarEvolucaoPorTickers,
    //buscarAcaoPorTicker,
    buscarAcoesUnicas
};
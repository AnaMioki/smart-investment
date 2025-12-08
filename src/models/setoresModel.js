var database = require("../database/config")

function receberSetoresParam(setor, anos, perfil) {
    var instrucaoSql = `   SELECT 
            setor,
            
            -- Retorna o número total de ações disponíveis para este perfil neste setor
            SUM(qtd_empresas) as total_acoes_disponiveis,
            
            -- Cálculos de média ponderada (Soma total / Quantidade total)
            TRUNCATE(SUM(soma_retorno) / SUM(qtd_empresas), 2) as rentabilidade_periodo,
            TRUNCATE(SUM(soma_volatilidade) / SUM(qtd_empresas), 2) as volatilidade_periodo,
            TRUNCATE(SUM(soma_dre) / SUM(qtd_empresas), 2) as DRE,
            TRUNCATE(SUM(soma_ebitda) / SUM(qtd_empresas), 2) as EBITDA
            
        FROM dashboard_consolidado_usuario
        WHERE ano_referencia IN (${anos})
          AND perfil_investidor =  ('${perfil}') COLLATE utf8mb4_unicode_ci AND setor like '%${setor}%'
        GROUP BY setor
        ORDER BY rentabilidade_periodo DESC;`;
    console.log("Executando a instrução do SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql)
}

function receberSetores(anos, perfil) {
    var instrucaoSql = `
        SELECT 
            setor,
            
            -- Retorna o número total de ações disponíveis para este perfil neste setor
            SUM(qtd_empresas) as total_acoes_disponiveis,
            
            -- Cálculos de média ponderada (Soma total / Quantidade total)
            TRUNCATE(SUM(soma_retorno) / SUM(qtd_empresas), 2) as rentabilidade_periodo,
            TRUNCATE(SUM(soma_volatilidade) / SUM(qtd_empresas), 2) as volatilidade_periodo,
            TRUNCATE((SUM(soma_dre) / SUM(qtd_empresas)/10), 2) as DRE,
            TRUNCATE(SUM(soma_ebitda) / SUM(qtd_empresas), 2) as EBITDA
            
        FROM dashboard_consolidado_usuario
        WHERE ano_referencia IN (${anos})
          AND perfil_investidor =  ('${perfil}') COLLATE utf8mb4_unicode_ci
        GROUP BY setor
        ORDER BY rentabilidade_periodo DESC;
    `;
    console.log("Executando a instrução do SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql)
}

function buscarAcoesSetor(setor, limite) {
    var instrucaoSql = `select nome, ticker from empresa where setor = '${setor}' LIMIT ${limite};`;
    console.log("Executando a instrução do SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql)
}


function buscarAcoesUnicas(ticker, anos, idUsuario) {
    var instrucaoSql =
        `SELECT 
    e.*, 
    TRUNCATE(AVG(a.precoFechamento), 2) AS media_preco_fechamento,
    MAX(a.precoMaisAlto) AS max_preco_alto,
    MIN(a.precoMaisBaixo) AS min_preco_baixo,
    TRUNCATE(AVG(a.volume), 2) AS media_volume,
    TRUNCATE(it.EBITDA, 2) AS EBITDA,
    TRUNCATE(it.valorMercado,2) AS DRE,
    TRUNCATE(it.rentabilidadeAnual, 2) AS retorno,
    TRUNCATE(((MAX(a.precoMaisAlto) - MIN(a.precoMaisBaixo)) / AVG(a.precoFechamento)) * 100, 2) AS volatilidade_media_ano,
    CASE 
        WHEN MAX(af.idAcoesFavoritadas) IS NOT NULL THEN 1
        ELSE 0
    END AS favoritada

FROM empresa e
JOIN acoes a 
    ON e.idEmpresa = a.fkEmpresa
JOIN infoTemporal it 
    ON it.fkEmpresa = e.idEmpresa
    AND it.ano IN (${anos})
LEFT JOIN acoesFavoritadas af
    ON af.fkAcoes = e.idEmpresa
    AND af.fkUsuario = ${idUsuario}

WHERE 
    e.ticker = '${ticker}'
    AND YEAR(a.dtAtual) IN (${anos})

GROUP BY 
    e.idEmpresa, 
    it.EBITDA,             
    it.valorMercado,       
    it.rentabilidadeAnual
LIMIT 1;
`;
    console.log("Executando a instrução do SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql)
}



function evolucaoMeses(idEmpresa, ano) {
    var instrucaoSql =
        `
    SELECT 
    e.ticker,
    YEAR(a.dtAtual) AS ano,
    MONTH(a.dtAtual) AS mes,
    ROUND(AVG(a.precoFechamento), 2) AS preco_medio_mes
FROM acoes a JOIN empresa e  ON a.fkEmpresa = e.idEmpresa WHERE e.ticker = '${idEmpresa}'
  AND YEAR(a.dtAtual) IN (${ano})
GROUP BY ano, mes
ORDER BY mes;
`;
    console.log("Executando a instrução do SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql)
}

module.exports = {
    receberSetores,
    buscarAcoesSetor,
    buscarAcoesUnicas,
    receberSetoresParam,
    evolucaoMeses
}
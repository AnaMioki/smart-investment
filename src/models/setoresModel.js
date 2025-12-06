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
            TRUNCATE((SUM(soma_dre) / SUM(qtd_empresas)/100000), 2) as DRE,
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


function buscarAcoesUnicas(ticker, anos) {
    var instrucaoSql = `SELECT 
    e.*, 
    TRUNCATE(AVG(a.precoFechamento), 2) AS media_preco_fechamento,
    MAX(a.precoMaisAlto) AS max_preco_alto,
    MIN(a.precoMaisBaixo) AS min_preco_baixo,
    TRUNCATE(AVG(a.volume), 2) AS media_volume
FROM empresa e
JOIN acoes a 
    ON e.idEmpresa = a.fkEmpresa
WHERE 
    e.ticker = '${ticker}'
    AND a.dtAtual BETWEEN
        (
            SELECT DATE_SUB(MAX(dtAtual), INTERVAL ${anos} YEAR)
            FROM acoes 
            WHERE fkEmpresa = e.idEmpresa
        )
        AND
        (
            SELECT MAX(dtAtual)
            FROM acoes 
            WHERE fkEmpresa = e.idEmpresa
        )
GROUP BY e.idEmpresa
LIMIT 1;`;
    console.log("Executando a instrução do SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql)
}




module.exports = {
    receberSetores,
    buscarAcoesSetor,
    buscarAcoesUnicas,
    receberSetoresParam
}
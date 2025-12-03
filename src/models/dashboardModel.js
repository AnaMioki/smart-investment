var database = require("../database/config");

function receberDashboard(anos) {
    // Tratamento para transformar o array [2023, 2024] em string "2023, 2024"
    const anosString = anos.join(',');

    var instrucaoSql = `
        SELECT 
            setor,
            -- A mágica da média ponderada correta:
            TRUNCATE(SUM(soma_retorno) / SUM(qtd_empresas), 2) as rentabilidade_periodo,
            TRUNCATE(SUM(soma_volatilidade) / SUM(qtd_empresas), 2) as volatilidade_periodo,
            TRUNCATE(SUM(soma_dre) / SUM(qtd_empresas), 2) as DRE,
            TRUNCATE(SUM(soma_ebitda) / SUM(qtd_empresas), 2) as EBITDA
        FROM dashboard_setorial_base
        WHERE ano_referencia IN (${anosString})
        GROUP BY setor
        ORDER BY rentabilidade_periodo DESC;
    `;

    console.log("Executando a instrução do SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    receberDashboard
};



/*var database = require("../database/config")
function receberDashboard() {
    var instrucaoSql = `SELECT 
    e.setor AS setor,
    TRUNCATE(AVG(a.precoFechamento),2) AS media_preco_fechamento,
    TRUNCATE(STDDEV_SAMP(a.precoFechamento),2) AS volatilidade,
    TRUNCATE(AVG(a.volume)/1000000,2) AS media_volume_milhoes,
    TRUNCATE(SUM(a.precoFechamento * a.volume) / SUM(a.volume),2) AS preco_medio_ponderado
FROM empresa e
JOIN acoes a ON e.idEmpresa = a.fkEmpresa
GROUP BY e.setor
ORDER BY preco_medio_ponderado DESC;`;
    console.log("Executando a instrução do SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql)
};

module.exports = {
    receberDashboard
};*/
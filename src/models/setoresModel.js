var database = require("../database/config")

function receberSetoresParam(setor) {
    var instrucaoSql = `select setor , count(*) as "quantidade" from empresa where setor != "Sem setor" and setor like '%${setor}%' group by setor;`;
    console.log("Executando a instrução do SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql)
}

function receberSetores() {
    var instrucaoSql = `select setor , count(*) as "quantidade" from empresa where setor != "Sem setor" group by setor;`;
    console.log("Executando a instrução do SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql)
}

function buscarAcoesSetor(setor) {
    var instrucaoSql = `select nome, ticker from empresa where setor = '${setor}';`;
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
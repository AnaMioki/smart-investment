var database = require("../database/config")

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


function buscarAcoesUnicas(ticker) {
    var instrucaoSql = `SELECT 
    e.*, 
    TRUNCATE(AVG(a.precoFechamento),2)AS media_preco_fechamento,
    MAX(a.precoMaisAlto) AS max_preco_alto,
    MIN(a.precoMaisBaixo) AS min_preco_baixo,
    TRUNCATE(AVG(a.volume),2) AS media_volume
FROM empresa e
JOIN acoes a ON e.idEmpresa = a.fkEmpresa
WHERE a.dtAtual BETWEEN '1998-01-01' AND '2001-01-01'
  AND e.ticker = '${ticker}'
GROUP BY e.idEmpresa
LIMIT 1;`;
    console.log("Executando a instrução do SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql)
}




module.exports = {
    receberSetores,
    buscarAcoesSetor,
    buscarAcoesUnicas
}
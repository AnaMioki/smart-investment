var database = require("../database/config")
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
};
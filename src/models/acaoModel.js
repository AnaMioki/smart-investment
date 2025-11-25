var database = require("../database/config");

function listarTodasAcoes() {
    var sql = `
        SELECT 
            e.idEmpresa,
            e.nome AS nomeEmpresa,
            e.ticker,
            e.setor,

            -- Preço atual (último fechamento)
            a.precoFechamento AS precoAtual,

            -- Volume médio das negociações
            a.volume AS volume,

            -- InfoTemporal
            it.rentabilidadeAnual AS retorno,
            it.patrimonioLiquidoAcao AS sharpe,
            -- colocar o beta, ou outra coisa aqui

        FROM empresa e
        LEFT JOIN acoes a 
            ON a.fkEmpresa = e.idEmpresa
        LEFT JOIN infoTemporal it
            ON it.fkEmpresa = e.idEmpresa

        -- caso tenha histórico, pegamos o último registro de ações
        GROUP BY e.idEmpresa;
        `;
        // colocar por setor (ORDER BY e.setor, e.nome;)
    return database.executar(sql);
}


        // SELECT 
        //     e.idEmpresa,
        //     e.nome AS empresa,
        //     e.ticker,
        //     e.setor,
        //     ROUND(AVG(a.precoFechamento), 2) AS precoMedio,
        //     ROUND(MAX(a.precoMaisAlto), 2) AS precoMaximo,
        //     ROUND(MIN(a.precoMaisBaixo), 2) AS precoMinimo,
        //     ROUND(AVG(a.volume), 2) AS volumeMedio
        // FROM empresa e
        // JOIN acoes a 
        //     ON a.fkEmpresa = e.idEmpresa
        // GROUP BY 
        //     e.idEmpresa, e.nome, e.ticker, e.setor;




        //informações especificas ao clicar em uma acao
    //     -- dados calculados da tabela 'acoes'
    // TRUNCATE(AVG(a.precoFechamento), 2) AS precoMedio,
    // TRUNCATE(AVG(a.volume), 2) AS volumeMedio,
    // TRUNCATE(AVG(a.precoMaisAlto), 2) AS maxPreco,
    // TRUNCATE(AVG(a.precoMaisBaixo), 2) AS minPreco,

function buscarAcaoPorTicker(ticker) {
    var sql = `
        SELECT 
            e.*,
            TRUNCATE(AVG(a.precoFechamento),2) AS precoMedio,
            MAX(a.precoMaisAlto) AS maxPreco,
            MIN(a.precoMaisBaixo) AS minPreco,
            TRUNCATE(AVG(a.volume),2) AS volumeMedio
        FROM empresa e
        JOIN acoes a ON a.fkEmpresa = e.idEmpresa
        WHERE e.ticker = '${ticker}'
        GROUP BY e.idEmpresa;
    `;
    return database.executar(sql);
}

function listarAcoesPorSetor(setor) {
    var sql = `
        SELECT 
            e.nome,
            e.ticker,
            e.setor
        FROM empresa e
        WHERE e.setor = '${setor}';
    `;
    return database.executar(sql);
}

// function filtrarAcoes(termo) {
//     var sql = `
//         SELECT nome, ticker, setor
//         FROM empresa
//         WHERE nome LIKE '%${termo}%' OR ticker LIKE '%${termo}%';
//     `;
//     return database.executar(sql);
// }

function listarHistoricoPreco(ticker) {
    var sql = `
        SELECT 
            a.dtAtual,
            a.precoFechamento
        FROM acoes a
        JOIN empresa e ON a.fkEmpresa = e.idEmpresa
        WHERE e.ticker = '${ticker}'
        ORDER BY a.dtAtual ASC;
    `;
    return database.executar(sql);
}

module.exports = {
    listarTodasAcoes,
    buscarAcaoPorTicker,
    listarAcoesPorSetor,
    filtrarAcoes,
    listarHistoricoPreco
};

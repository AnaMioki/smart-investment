var database = require("../database/config")

function receberNotificacoes(idUsuario) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function receberNotificacoes(): ")

    var instrucaoSql = `
        SELECT n.tipo, n.mensagem, n.dtNotificacao, n.lido, n.fkAcoes, n.fkUsuario, e.ticker
        FROM notificacoes n
        JOIN usuario u ON n.fkUsuario = u.idUsuario
        JOIN acoes a ON n.fkAcoes = a.idAcoes
        JOIN empresa e ON a.fkEmpresa = e.idEmpresa
        WHERE fkUsuario = ${idUsuario}
        ORDER BY dtNotificacao desc;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function receberNotificacoesNaoLida(idUsuario) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function receberNotificacoesNaoLidas(): ")

    var instrucaoSql = `
        SELECT n.tipo, n.mensagem, n.dtNotificacao, n.lido, n.fkAcoes, n.fkUsuario, e.ticker
        FROM notificacoes n
        JOIN usuario u ON n.fkUsuario = u.idUsuario
        JOIN acoes a ON n.fkAcoes = a.idAcoes
        JOIN empresa e ON a.fkEmpresa = e.idEmpresa
        WHERE fkUsuario = ${idUsuario} and lido = 0
        ORDER BY dtNotificacao desc;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function receberNotCount(idUsuario) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function receberNotificacoesNaoLidas(): ")

    var instrucaoSql = `
        SELECT COUNT(*) as nao_lidos
        FROM notificacoes
        WHERE fkUsuario = ${idUsuario} and lido = 0;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function atualizarNotificoesNaoLidas(idUsuario) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function atualizarNotificoesNaoLidas(): ")

    var instrucaoSql = `
        UPDATE notificacoes
        SET lido = 1
        WHERE fkUsuario = ${idUsuario};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    receberNotificacoes,
    receberNotificacoesNaoLida,
    receberNotCount,
    atualizarNotificoesNaoLidas
};

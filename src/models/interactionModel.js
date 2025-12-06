var database = require("../database/config")
var crypto = require('crypto');

function hashSenha(senha) {
    return crypto.createHash('sha256').update(senha).digest('hex');
}



function favoritarAcao(idacao, idUsuario) {

    var instrucaoSql = `
        INSERT INTO acoesFavoritadas VALUES (DEFAULT, ${idacao}, ${idUsuario});
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function desfavoritarAcao(idacao, idUsuario) {
    var instrucaoSql = `
        DELETE FROM acoesFavoritadas WHERE fkAcoes = ${idacao} AND fkUsuario = ${idUsuario};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}




module.exports = {
    favoritarAcao,
    desfavoritarAcao
}
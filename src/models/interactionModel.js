var database = require("../database/config")
var crypto = require('crypto');

function hashSenha(senha) {
    return crypto.createHash('sha256').update(senha).digest('hex');
}

function receberDados(email, senha) {
    const senhaHash = hashSenha(senha);
    var instrucaoSql = `
        SELECT idUsuario, nome, email, perfil FROM usuario WHERE email = '${email}' AND senha = '${senhaHash}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    receberDados
}
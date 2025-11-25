var database = require("../database/config")
var crypto = require('crypto');

function hashSenha(senha) {
    return crypto.createHash('sha256').update(senha).digest('hex');
}


function autenticar(email, senha) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", email, senha)

    const senhaHash = hashSenha(senha);

    var instrucaoSql = `
        SELECT idUsuario, nome, email, perfil FROM usuario WHERE email = '${email}' AND senha = '${senhaHash}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


function cadastrar(nome, dtNascimento, email, senha, perfil) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", nome, dtNascimento, email, senha, perfil);

    const senhaHash = hashSenha(senha);

    var instrucaoSql = `
    INSERT INTO usuario (nome, dtNascimento, email, senha, perfil)
        VALUES ('${nome}', '${dtNascimento}', '${email}', '${senhaHash}', '${perfil}');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


function alterar(perfil, email) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function alterar(): ", perfil)

    var instrucaoSql = `
        UPDATE usuario
        SET perfil = '${perfil}'
        WHERE email = '${email}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    autenticar,
    cadastrar,
    alterar
};
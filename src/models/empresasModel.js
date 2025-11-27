var database = require("../database/config");

function listarEmpresas() {
    var instrucaoSql = `SELECT * FROM empresa;`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function cadastrarEmpresa(dados) {
    function esc(v){ return String(v ?? "").replace(/'/g, "\\'"); }
    const nome = esc(dados.nomeEmpresa);
    const setor = esc(dados.setor);
    const ticker = esc(dados.ticker ?? '');
    const logoURL = esc(dados.logoURL ?? '');

    var instrucaoSql = `INSERT INTO empresa (nome, setor, ticker, logo) VALUES ('${nome}', '${setor}', '${ticker}', '${logoURL}');`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function editarEmpresa(dados) {
    const id = parseInt(dados.idEmpresa);
    if (isNaN(id)) return Promise.reject(new Error("idEmpresa inválido"));

    function esc(v){ return String(v ?? "").replace(/'/g, "\\'"); }

    const nome = esc(dados.nomeEmpresa);
    const setor = esc(dados.setor);
    const ticker = esc(dados.ticker);
    const logoURL = esc(dados.logoURL);

    const instrucaoSql = `
        UPDATE empresa
        SET nome = '${nome}',
            setor = '${setor}',
            ticker = '${ticker}',
            logo = '${logoURL}'
        WHERE idEmpresa = ${id};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function excluirEmpresa(idEmpresa) {
    const id = parseInt(idEmpresa);
    if (isNaN(id)) {
        return Promise.reject(new Error('idEmpresa inválido'));
    }
    var instrucaoSql = `DELETE FROM empresa WHERE idEmpresa = ${id};`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql + "\nCom id: " + id);
    return database.executar(instrucaoSql);
}

module.exports = {
    listarEmpresas,
    cadastrarEmpresa,
    editarEmpresa,
    excluirEmpresa
};
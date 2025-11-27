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

    var instrucaoSql = `INSERT INTO empresa (nome, setor, ticker) VALUES ('${nome}', '${setor}', '${ticker}');`;
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

    const instrucaoSql = `
        UPDATE empresa
        SET nome = '${nome}',
            setor = '${setor}',
            ticker = '${ticker}'
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
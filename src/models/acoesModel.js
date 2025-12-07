var database = require("../database/config");

function listarTodasAcoesDeAcordoComPerfil() {
    var instrucaoSql = `
    SELECT 
    e.idEmpresa,
    e.nome,
    e.setor,
    it.rentabilidadeAnual,
    it.precoSobreValorPatrimonial,
    sub.volatilidade_media_ano,
     --  DRE da ação
    ( (it.valorMercado - it.patrimonioLiquido) / it.patrimonioLiquido ) AS dre,

    --  EBITDA da ação
    ( it.valorMercado / it.multiploSetorial ) AS ebitda,
     it.volume,

    it.ano -- n tenho crtza
        FROM empresa e
        JOIN infoTemporal it ON e.idEmpresa = it.fkEmpresa
        JOIN sub_acoes_calculado sub ON sub.fkEmpresa = e.idEmpresa;
        -- garante que vai vir a ação mais recente
        -- isso só funciona se todas as empresas tiverem o mesmo conjunto de anos se não, pode “sumir” empresa
        WHERE it.ano = (SELECT MAX(ano) FROM infoTemporal);
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

//código do gui


module.exports = {  
listarTodasAcoesDeAcordoComPerfil
};
var database = require("../database/config");

function listarTodasAcoesDeAcordoComPerfil() {
    var instrucaoSql = `
    SELECT 
    e.idEmpresa,
    e.nome,
    e.setor,
    it.rentabilidadeAnual,
    it.precoSobreValorPatrimonial,

    -- comentei por enquanto esse valor pq não existe no banco: 
    -- sub.volatilidade_media_ano,


     --  DRE da ação
    ( (it.valorMercado - it.patrimonioLiquido) / it.patrimonioLiquido ) AS dre,

    --  EBITDA da ação
    ( it.valorMercado / it.multiploSetorial ) AS ebitda,
     it.volume,

    it.ano -- n tenho crtza
        FROM empresa e
        JOIN infoTemporal it ON e.idEmpresa = it.fkEmpresa
        JOIN sub_acoes_calculado sub ON sub.fkEmpresa = e.idEmpresa
        -- garante que vai vir a ação mais recente
        -- isso só funciona se todas as empresas tiverem o mesmo conjunto de anos se não, pode “sumir” empresa
        WHERE it.ano = (SELECT MAX(ano) FROM infoTemporal);
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// mesmissima lógica da consulta pra pegar ação com base no perfil, mas agora filtrando por setor como parametro.
function listarAcoesPorSetor(setor) {
    var instrucaoSql = `
        SELECT 
            e.idEmpresa,
            e.nome,
            e.setor,
            it.rentabilidadeAnual,
            it.precoSobreValorPatrimonial,

            -- comentei por enquanto esse valor pq não existe no banco: 
            -- sub.volatilidade_media_ano,

            -- DRE
            ((it.valorMercado - it.patrimonioLiquido) / it.patrimonioLiquido) AS dre,

            -- EBITDA
            (it.valorMercado / it.multiploSetorial) AS ebitda,

            it.volume,
            it.ano

        FROM empresa e
        JOIN infoTemporal it 
            ON e.idEmpresa = it.fkEmpresa
        JOIN sub_acoes_calculado sub 
            ON sub.fkEmpresa = e.idEmpresa
        
        WHERE it.ano = (SELECT MAX(ano) FROM infoTemporal)
        AND e.setor = '${setor}';
    `;

    console.log("Executando SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}



module.exports = {  
listarTodasAcoesDeAcordoComPerfil,
listarAcoesPorSetor
};
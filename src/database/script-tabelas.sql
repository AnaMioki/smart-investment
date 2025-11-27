CREATE DATABASE IF NOT EXISTS smart_investment;
USE smart_investment;
SET foreign_key_checks = 0;

CREATE TABLE usuario (
idUsuario INT PRIMARY KEY AUTO_INCREMENT,
nome VARCHAR(70) NOT NULL,
dtNascimento DATE,
email VARCHAR(60) NOT NULL UNIQUE,
senha VARCHAR(255) NOT NULL,
perfil VARCHAR(20),
	CONSTRAINT chkPerfil 
		CHECK (perfil IN ('Conservador', 'Moderado', 'Arrojado'))
); 

CREATE TABLE empresa (
idEmpresa INT PRIMARY KEY AUTO_INCREMENT,
nome VARCHAR(80) NOT NULL,
ticker VARCHAR(10) NOT NULL,
setor VARCHAR(100) NOT NULL,
logo VARCHAR(255)
);

CREATE TABLE acoes (
idAcoes INT PRIMARY KEY AUTO_INCREMENT,
dtAtual DATE NOT NULL,
precoAbertura DOUBLE NOT NULL,
precoFechamento DOUBLE NOT NULL,
precoMaisAlto DOUBLE NOT NULL,
precoMaisBaixo DOUBLE NOT NULL,
volume DOUBLE NOT NULL,
fkEmpresa INT,
CONSTRAINT fkAcoesEmpresa FOREIGN KEY (fkEmpresa) REFERENCES empresa(idEmpresa)
);

CREATE TABLE acoesFavoritadas (
idAcoesFavoritadas INT PRIMARY KEY AUTO_INCREMENT,
fkAcoes INT NOT NULL,
CONSTRAINT fkAcoesFavoritadas FOREIGN KEY (fkAcoes) REFERENCES acoes(idAcoes),
fkUsuario INT NOT NULL,
CONSTRAINT fkUsuarioAcoesFavoritadas FOREIGN KEY (fkUsuario) REFERENCES usuario(idUsuario)
);

CREATE TABLE notificacoes (
idNotificacoes INT PRIMARY KEY AUTO_INCREMENT,
tipo VARCHAR(30),
CONSTRAINT chkTipoNotificacoes
		CHECK (tipo IN ('Ação sugerida', 'Ação Favoritada', 'Alerta')),
mensagem VARCHAR(255),
dtNotificacao DATETIME DEFAULT CURRENT_TIMESTAMP(),
lido TINYINT DEFAULT 0,
fkAcoes INT NOT NULL,
CONSTRAINT fkAcoesNotificacoes FOREIGN KEY (fkAcoes) REFERENCES acoes(idAcoes),
fkUsuario INT NOT NULL,
CONSTRAINT fkUsuarioNotificacoes FOREIGN KEY (fkUsuario) REFERENCES usuario(idUsuario)
);

CREATE TABLE log (
idLog INT PRIMARY KEY AUTO_INCREMENT,
tipo VARCHAR(255),
CONSTRAINT chkTipoLog
		CHECK (tipo IN ('Sucesso', 'Alerta', 'Erro')),
dtLog DATETIME NOT NULL,
mensagemErro TEXT
);

CREATE TABLE infoTemporal (
idInfo INT AUTO_INCREMENT,
valorMercado DOUBLE,
patrimonioLiquido DOUBLE,
patrimonioLiquidoAcao DOUBLE,
multiploSetorial INT,
rentabilidadeAnual DOUBLE,
infoTemporalcol DOUBLE,
precoSobreValorPatrimonial DOUBLE,
EBITDA DOUBLE,
DRE DOUBLE,
fkEmpresa INT NOT NULL,
ano INT,
CONSTRAINT fkEmpresainfo FOREIGN KEY(fkEmpresa) REFERENCES empresa (idEmpresa),
CONSTRAINT primariesKeyInfoEmpresa PRIMARY KEY (idInfo, fkEmpresa)
);



-- INSERT INTO usuario (nome, dtNascimento, email, senha, perfil) VALUES
-- ('Juliana Santos', '1990-05-12', 'juliana.santos@email.com', 'senha123', 'Conservador'),
-- ('Bruno Cordeiro', '1985-09-23', 'bruno.cordeiro@email.com', 'senha123', 'Moderado'),
-- ('Carla Menezes', '1998-02-15', 'carla.menezes@email.com', 'senha123', 'Arrojado');

-- INSERT INTO empresa (nome, ticker, setor, logo) VALUES
-- ('Vale S.A.', 'VALE3', 'Mineração', 'vale_logo.png'),
-- ('Petrobras', 'PETR4', 'Energia', 'petrobras_logo.png'),
-- ('Itaú Unibanco', 'ITUB4', 'Financeiro', 'itau_logo.png');

-- INSERT INTO acoes (
--  dtAtual, precoAbertura, precoFechamento, precoMaisAlto, precoMaisBaixo, volume, ticker, fkEmpresa
-- ) VALUES (
--  '2025-09-30', 65.20, 66.50, 67.00, 64.90, 1000000, 'PETR4',
-- (SELECT idEmpresa FROM empresa WHERE ticker = 'PETR4')
-- );

-- ('2025-09-30', 34.10, 35.00, 35.50, 33.80, 2500000, 2), 
-- ('2025-09-30', 28.00, 27.50, 28.40, 27.30, 1800000, 3);

-- INSERT INTO acoesFavoritadas (fkAcoes, fkUsuario) VALUES
-- (1, 1),
-- (2, 2),
-- (3, 3);

-- INSERT INTO notificacoes (tipo, mensagem, fkAcoes, fkUsuario) VALUES
-- ('Ação sugerida', 'Vale é indicada para perfil conservador esta semana.', 1, 1),
-- ('Alerta', 'Petrobras atingiu queda de 5% hoje.', 2, 2),
-- ('Ação Favoritada', 'Itaú foi favoritada com sucesso.', 3, 3);

-- INSERT INTO log (tipo, dtLog, mensagemErro) VALUES
-- ('Sucesso', NOW(), 'Usuário cadastrou ação favorita'),
-- ('Alerta', NOW(), 'Petrobras caiu 5% em um dia'),
-- ('Erro', NOW(), 'Falha ao enviar notificação por e-mail');

/* CREATE VIEW dados AS
SELECT
    -- usuário
    u.idUsuario,
    u.nome AS nomeUsuario,
    u.dtNascimento,
    u.email,
    u.perfil,
    -- empresa
    e.idEmpresa,
    e.nome AS nomeEmpresa,
    e.ticker,
    e.setor,
    e.logo,
    -- ações
    a.idAcoes,
    a.dtAtual,
    a.precoAbertura,
    a.precoFechamento,
    a.precoMaisAlto,
    a.precoMaisBaixo,
    a.volume,
    a.fkEmpresa,
    -- ações favoritadas
    af.idAcoesFavoritadas,
    af.fkAcoes AS acaoFavoritada,
    af.fkUsuario AS usuarioFavoritou,
    -- notificações
    n.idNotificacoes,
    n.tipo AS tipoNotificacao,
    n.mensagem AS mensagemNotificacao,
    n.fkAcoes AS notificacaoAcao,
    n.fkUsuario AS notificacaoUsuario,
    -- log 
    l.idLog,
    l.tipo AS tipoLog,
    l.dtLog,
    l.mensagemErro

FROM usuario u
LEFT JOIN acoesFavoritadas af ON u.idUsuario = af.fkUsuario
LEFT JOIN acoes a ON af.fkAcoes = a.idAcoes
LEFT JOIN empresa e ON a.fkEmpresa = e.idEmpresa
LEFT JOIN notificacoes n ON u.idUsuario = n.fkUsuario
LEFT JOIN log l ON l.dtLog = (
    SELECT MAX(l2.dtLog) FROM log l2
);

-- SELECT * FROM dados;
SELECT * FROM empresa order by ticker asc;
SELECT * FROM empresa;
SELECT * FROM acoes;
SELECT * FROM log;

SELECT COUNT(*) FROM acoes;


 



-- select* FROM acoes order by dtAtual desc;
truncate table empresa ; */




--             INSERT PARA AJUDAR A ENTENDER OS DADOS      --
 
-- Inserir usuários
INSERT INTO usuario (nome, dtNascimento, email, senha, perfil) VALUES
('Ana Silva', '1985-03-15', 'ana.silva@email.com', '$2y$10$abc123', 'Conservador'),
('Carlos Oliveira', '1992-07-22', 'carlos.oliveira@email.com', '$2y$10$def456', 'Moderado'),
('Marina Costa', '1988-11-30', 'marina.costa@email.com', '$2y$10$ghi789', 'Arrojado'),
('Roberto Santos', '1979-05-18', 'roberto.santos@email.com', '$2y$10$jkl012', 'Conservador'),
('Juliana Lima', '1995-09-25', 'juliana.lima@email.com', '$2y$10$mno345', 'Moderado');

-- Inserir empresas
INSERT INTO empresa (nome, ticker, setor, logo) VALUES
('Vale S.A.', 'VALE3', 'Mineração', 'vale_logo.png'),
('Petrobras', 'PETR4', 'Energia', 'petrobras_logo.png'),
('Itaú Unibanco', 'ITUB4', 'Financeiro', 'itau_logo.png'),
('Ambev S.A.', 'ABEV3', 'Bebidas', 'ambev_logo.png'),
('Magazine Luiza', 'MGLU3', 'Varejo', 'magalu_logo.png');

-- Inserir ações
INSERT INTO acoes (dtAtual, precoAbertura, precoFechamento, precoMaisAlto, precoMaisBaixo, volume, fkEmpresa) VALUES
('2024-05-20', 68.90, 70.15, 71.20, 68.50, 25000000, 1),
('2024-05-20', 32.45, 33.10, 33.80, 32.10, 18000000, 2),
('2024-05-20', 34.20, 35.05, 35.60, 34.00, 22000000, 3),
('2024-05-20', 14.80, 15.25, 15.40, 14.65, 15000000, 4),
('2024-05-20', 2.15, 2.08, 2.20, 2.05, 35000000, 5);

-- Inserir ações favoritadas
INSERT INTO acoesFavoritadas (fkAcoes, fkUsuario) VALUES
(1, 1), -- Ana favorita Vale
(3, 2), -- Carlos favorita Itaú
(5, 3), -- Marina favorita Magazine Luiza
(2, 4), -- Roberto favorita Petrobras
(4, 5); -- Juliana favorita Ambev

-- Inserir notificações
INSERT INTO notificacoes (tipo, mensagem, fkAcoes, fkUsuario) VALUES
('Ação Favoritada', 'VALE3 atingiu seu preço-alvo recomendado', 1, 1),
('Alerta', 'PETR4 caiu mais de 2% no dia', 2, 2),
('Ação sugerida', 'ITUB4 é uma boa oportunidade para seu perfil', 3, 3),
('Alerta', 'ABEV3 apresentou alta volumétrica', 4, 4),
('Ação Favoritada', 'MGLU3 atingiu nova máxima do mês', 5, 5);

-- Inserir registros de log
INSERT INTO log (tipo, dtLog, mensagemErro) VALUES
('Sucesso', NOW(), 'Usuário 1 favoritou ação VALE3 com sucesso'),
('Alerta', NOW(), 'Variação anormal detectada em PETR4'),
('Erro', NOW(), 'Falha no envio de email para usuário 3'),
('Sucesso', NOW(), 'Cálculo de indicadores concluído para 05/05/2024'),
('Alerta', NOW(), 'Tentativa de acesso não autorizado detectada');

-- Inserir informações temporais
INSERT INTO infoTemporal (valorMercado, patrimonioLiquido, patrimonioLiquidoAcao, multiploSetorial, rentabilidadeAnual, precoSobreValorPatrimonial, EBTDA, DRE, fkEmpresa, ano) VALUES
(450.50, 280.30, 35.20, 8, 12.5, 1.98, 45.60, 120.30, 1, 2025),
(320.25, 190.15, 28.10, 6, 8.7, 1.45, 32.10, 98.40, 2, 2025),
(280.80, 165.90, 22.50, 10, 15.2, 2.10, 28.90, 110.20, 3, 2025),
(180.40, 95.60, 12.30, 12, 18.3, 2.45, 19.20, 75.80, 4, 2025),
(450.50, 280.30, 35.20, 8, 9, 1.98, 45.60, 120.30, 1, 2024),
(45.20, 28.40, 3.15, 15, 22.1, 3.20, 8.90, 25.30, 5, 2025);

-- Consultas para verificação dos dados
SELECT '=== USUÁRIOS ===' AS '';
SELECT * FROM usuario;

SELECT '=== EMPRESAS ===' AS '';
SELECT * FROM empresa;

SELECT '=== AÇÕES ===' AS '';
SELECT a.*, e.ticker 
FROM acoes a 
JOIN empresa e ON a.fkEmpresa = e.idEmpresa;

SELECT '=== AÇÕES FAVORITADAS ===' AS '';
SELECT af.*, u.nome as usuario, e.ticker
FROM acoesFavoritadas af
JOIN usuario u ON af.fkUsuario = u.idUsuario
JOIN acoes a ON af.fkAcoes = a.idAcoes
JOIN empresa e ON a.fkEmpresa = e.idEmpresa;

SELECT '=== NOTIFICAÇÕES ===' AS '';
SELECT n.*, u.nome as usuario, e.ticker
FROM notificacoes n
JOIN usuario u ON n.fkUsuario = u.idUsuario
JOIN acoes a ON n.fkAcoes = a.idAcoes
JOIN empresa e ON a.fkEmpresa = e.idEmpresa;

SELECT '=== LOGS ===' AS '';
SELECT * FROM log;

SELECT '=== INFORMAÇÕES TEMPORAIS ===' AS '';
SELECT it.*, e.ticker
FROM infoTemporal it
JOIN empresa e ON it.fkEmpresa = e.idEmpresa;

/*--        VIEW PARA PUXAR AS INFORMAÇÕES     --
CREATE VIEW vw_dash_setores AS
SELECT 
    e.setor,
    COUNT(DISTINCT e.idEmpresa) AS quantidade_acoes,
    
    -- KPIs e métricas principais
    AVG(it.rentabilidadeAnual) AS retorno_medio,
    AVG(((a.precoMaisAlto - a.precoMaisBaixo) / a.precoAbertura) * 100) AS volatilidade_media,
    AVG(it.patrimonioLiquidoAcao) AS patrimonio_liquido_por_acao,
    
    -- Cálculo do DRE 
    AVG((it.valorMercado - it.partrimonioLiquido) / it.partrimonioLiquido) AS dre_medio,
    
    -- EBITDA calculado como valorMercado / múltiploSetorial
    AVG(it.valorMercado / it.multiploSetorial) AS ebitda_medio,
    
    -- Liquidez (volume médio)
    AVG(a.volume) AS liquidez_media,
    
    -- Estabilidade (inverso da volatilidade - quanto menor a volatilidade, maior a estabilidade)
    (100 - AVG(((a.precoMaisAlto - a.precoMaisBaixo) / a.precoAbertura) * 100)) AS estabilidade_media,
    
    -- Identificação do melhor performer
    CASE 
        WHEN AVG(it.rentabilidadeAnual) = (
            SELECT MAX(retorno_medio) FROM (
                SELECT AVG(it2.rentabilidadeAnual) AS retorno_medio
                FROM empresa e2
                JOIN infoTemporal it2 ON e2.idEmpresa = it2.fkEmpresa
                GROUP BY e2.setor
            ) sub
        ) THEN 1 ELSE 0 
    END AS eh_melhor_performer,
    
    -- Identificação do maior volatilidade
    CASE 
        WHEN AVG(((a.precoMaisAlto - a.precoMaisBaixo) / a.precoAbertura) * 100) = (
            SELECT MAX(volatilidade_media) FROM (
                SELECT AVG(((a2.precoMaisAlto - a2.precoMaisBaixo) / a2.precoAbertura) * 100) AS volatilidade_media
                FROM empresa e2
                JOIN acoes a2 ON e2.idEmpresa = a2.fkEmpresa
                GROUP BY e2.setor
            ) sub
        ) THEN 1 ELSE 0 
    END AS eh_maior_volatilidade

FROM empresa e
JOIN acoes a ON e.idEmpresa = a.fkEmpresa
JOIN infoTemporal it ON e.idEmpresa = it.fkEmpresa
GROUP BY e.setor;

-- SELECTS PARA VER O RESULTADO --

-- 1. Dados completos para a lista de setores
SELECT 
    setor,
    quantidade_acoes,
    ROUND(retorno_medio, 2) AS retorno_percentual,
    ROUND(dre_medio, 2) AS dre,
    ROUND(ebitda_medio, 2) AS ebitda,
    ROUND(volatilidade_media, 2) AS volatilidade,
    CASE 
        WHEN retorno_medio > 20 THEN 'Alta'
        WHEN retorno_medio BETWEEN 0 AND 15 THEN 'Estável' 
        ELSE 'Baixa'
    END AS tendencia
FROM vw_dash_setores
ORDER BY retorno_medio DESC;

-- 2. KPIs principais para o topo da página
SELECT 
    COUNT(DISTINCT setor) AS total_setores,
    (SELECT setor FROM vw_dash_setores WHERE eh_melhor_performer = 1) AS melhor_performer,
    (SELECT setor FROM vw_dash_setores WHERE eh_maior_volatilidade = 1) AS maior_volatilidade
FROM vw_dash_setores;

-- 3. Dados para o gráfico radar (Comparativo Multidimensional)
SELECT 
    setor,
    ROUND(retorno_medio, 2) AS retorno,
    ROUND(patrimonio_liquido_por_acao, 2) AS patrimonio_liquido_por_acao,
    ROUND(liquidez_media, 2) AS liquidez,
    ROUND(estabilidade_media, 2) AS estabilidade
FROM vw_dash_setores
WHERE setor IN ('Tecnologia', 'Saúde', 'Financeiro', 'Energia', 'Mineração')
ORDER BY setor;

-- 4. Dados para o gráfico de barras (Retorno vs Volatilidade vs Patrimônio Líquido por Ação)
SELECT 
    setor,
    ROUND(retorno_medio, 2) AS retorno,
    ROUND(volatilidade_media, 2) AS volatilidade,
    ROUND(patrimonio_liquido_por_acao, 2) AS patrimonio_liquido_por_acao
FROM vw_dash_setores
ORDER BY retorno_medio DESC;

-- 5. Dados detalhados para o popup de ações individuais
SELECT 
    e.nome AS nome_empresa,
    e.ticker,
    e.setor,
    a.precoFechamento AS preco_atual,
    a.precoAbertura,
    a.precoMaisAlto,
    a.precoMaisBaixo,
    a.volume,
    it.valorMercado AS market_cap,
    it.multiploSetorial AS pe_ratio,
    it.rentabilidadeAnual,
    -- Cálculo da variação percentual do dia
    ROUND(((a.precoFechamento - a.precoAbertura) / a.precoAbertura * 100), 2) AS variacao_percentual
FROM empresa e
JOIN acoes a ON e.idEmpresa = a.fkEmpresa
JOIN infoTemporal it ON e.idEmpresa = it.fkEmpresa
WHERE e.ticker = 'PETR4'
ORDER BY a.dtAtual DESC
LIMIT 1;

--  --------------------------------------- UMA FORMA QUE ACHEI MAIS FÁCIL DE FAZER, MAS TALVEZ O OUTRO SELECT SEJA MAIS COMPLETO ----------------------------------------------
SELECT 
    fkEmpresa,
    AVG(rentabilidadeAnual) AS retorno_medio_3_anos
FROM infoTemporal
WHERE ano >= (SELECT MAX(ano) - 2 FROM infoTemporal it2 WHERE it2.fkEmpresa = infoTemporal.fkEmpresa)
GROUP BY fkEmpresa;

-- -----  SELECT DO RETORNO LEVANDO EM CONSIDERAÇÃO OS ANOS DOS FILTROS, 1, 2 E 3 ANOS --
SELECT 
    -- Média dos últimos 3 anos
    (SELECT AVG(rentabilidadeAnual) 
     FROM infoTemporal it2 
     WHERE it2.fkEmpresa = it.fkEmpresa 
     AND it2.ano IN (
         SELECT DISTINCT ano 
         FROM infoTemporal it3 
         WHERE it3.fkEmpresa = it.fkEmpresa 
         ORDER BY ano DESC)) AS retorno_medio_3_anos
    
   /* -- Média dos últimos 2 anos
    (SELECT AVG(rentabilidadeAnual) 
     FROM infoTemporal it2 
     WHERE it2.fkEmpresa = it.fkEmpresa 
     AND it2.ano IN (
         SELECT DISTINCT ano 
         FROM infoTemporal it3 
         WHERE it3.fkEmpresa = it.fkEmpresa 
         ORDER BY ano DESC)) AS retorno_medio_2_anos,
    
    -- Último ano apenas
    (SELECT rentabilidadeAnual 
     FROM infoTemporal it2 
     WHERE it2.fkEmpresa = it.fkEmpresa 
     ORDER BY ano DESC ) AS retorno_1_ano

FROM infoTemporal it
GROUP BY it.fkEmpresa;

-- ---------
select retorno_medio from vw_dash_setores join infoTemporal i on i.fkEmpresa = e.idEmpresa where ano = 2025;

select melhor_performer from vw_dash_setores;
drop view vw_dash_setores;

select retorno_medio from vw_dash_setores;
describe infoTemporal;
describe empresa;

select avg(rentabilidadeAnual) from infoTemporal i join empresa e on i.fkEmpresa = e.idEmpresa;
select dtAtual from acoes;
describe acoes;
-- DROP VIEW vw_dash_setores;
show tables;
select ebitda from vw_dash_setores; */


CREATE OR REPLACE VIEW dashboard_setorial_detalhado AS
SELECT 
    e.setor,
    it.ano,
    it.rentabilidadeAnual AS retorno,
    it.DRE AS DRE, -- onde está sharpe
    ((a.precoMaisAlto - a.precoMaisBaixo) / a.precoAbertura) * 100 AS volatilidade,
    it.EBITDA AS EBITDA, -- onde está max_drawdown,
    e.idEmpresa
FROM infoTemporal it
INNER JOIN empresa e ON it.fkEmpresa = e.idEmpresa
INNER JOIN acoes a ON a.fkEmpresa = e.idEmpresa AND YEAR(a.dtAtual) = it.ano;

select * from infoTemporal;

			-- TELA DE DASHBOARD
-- MÉDIA PARA ANO ATUAL
SELECT 
    setor,
    AVG(retorno) AS retorno_medio,
    AVG(DRE) AS DRE_medio,
    AVG(volatilidade) AS volatilidade_media,
    AVG(EBITDA) AS EBITDA_medio,
    COUNT(DISTINCT idEmpresa) AS num_acoes
FROM dashboard_setorial_detalhado
WHERE setor = 'Mineração' 
AND ano >= (SELECT MAX(ano) FROM infoTemporal);

-- MÉDIA PARA 1 ANO
SELECT 
    setor,
    AVG(retorno) AS retorno_medio,
    AVG(DRE) AS DRE_medio,
    AVG(volatilidade) AS volatilidade_media,
    AVG(EBITDA) AS EBITDA_medio,
    COUNT(DISTINCT idEmpresa) AS num_acoes
FROM dashboard_setorial_detalhado
WHERE setor = 'Mineração' 
AND ano >= (SELECT MAX(ano) -1 FROM infoTemporal);

-- média para 2 anos
SELECT 
    setor,
    AVG(retorno) AS retorno_medio,
    AVG(DRE) AS DRE_medio,
    AVG(volatilidade) AS volatilidade_media,
    AVG(EBITDA) AS EBITDA_medio,
    COUNT(DISTINCT idEmpresa) AS num_acoes
FROM dashboard_setorial_detalhado
WHERE setor = 'Mineração' 
AND ano >= (SELECT MAX(ano) -1 FROM infoTemporal);


					-- TELA SETORES 

CREATE OR REPLACE VIEW dashboard_kpi_setorial AS
SELECT 
    e.setor,
    it.ano,
    -- Métricas para Melhor Performer: rentabilidadeAnual, precoSobreValorPatrimonial, valorMercado
    AVG(it.rentabilidadeAnual) AS retorno_medio,
    AVG(it.precoSobreValorPatrimonial) AS preco_sobre_vp_medio,
    AVG(it.valorMercado) AS valor_mercado_medio,
    -- Métrica para Volatilidade
    AVG(((a.precoMaisAlto - a.precoMaisBaixo) / a.precoAbertura) * 100) AS volatilidade_media,
    -- Contagem de empresas por setor e ano
    COUNT(DISTINCT e.idEmpresa) AS num_empresas
FROM infoTemporal it
INNER JOIN empresa e ON it.fkEmpresa = e.idEmpresa
INNER JOIN acoes a ON a.fkEmpresa = e.idEmpresa AND YEAR(a.dtAtual) = it.ano
GROUP BY e.setor, it.ano;
-- Vamos usar uma subconsulta para obter os últimos N (LIMIT X) anos e então agregar os dados por setor nesses anos.

-- Exemplo para 1 ano (ano mais recente)
SELECT 
    COUNT(DISTINCT setor) AS total_setores,
    (SELECT setor 
     FROM (
        SELECT setor, AVG(retorno_medio) AS retorno_medio
        FROM dashboard_kpi_setorial
        WHERE ano IN (SELECT MAX(ano) FROM dashboard_kpi_setorial)
        GROUP BY setor
        HAVING AVG(retorno_medio) >= 10 
           AND AVG(preco_sobre_vp_medio) <= 1 
           AND AVG(valor_mercado_medio) > 500000000
        ORDER BY retorno_medio DESC
        LIMIT 1
     ) AS performer
    ) AS melhor_performer,
    (SELECT setor 
     FROM (
        SELECT setor, AVG(volatilidade_media) AS volatilidade_media
        FROM dashboard_kpi_setorial
        WHERE ano IN (SELECT MAX(ano) FROM dashboard_kpi_setorial)
        GROUP BY setor
        ORDER BY volatilidade_media DESC
        LIMIT 1
     ) AS volatilidade
    ) AS maior_volatilidade
FROM dashboard_kpi_setorial
WHERE ano IN (SELECT MAX(ano) FROM dashboard_kpi_setorial);

--   EXEMPLO PARA 2 ANOS;
SELECT 
    COUNT(DISTINCT setor) AS total_setores,
    (SELECT setor 
     FROM (
        SELECT setor, AVG(retorno_medio) AS retorno_medio
        FROM dashboard_kpi_setorial
        WHERE ano IN (
            SELECT ano FROM (
                SELECT DISTINCT ano 
                FROM dashboard_kpi_setorial 
                ORDER BY ano DESC 
                LIMIT 2
            ) AS anos
        )
        GROUP BY setor
        HAVING AVG(retorno_medio) >= 10 
           AND AVG(preco_sobre_vp_medio) <= 1 
           AND AVG(valor_mercado_medio) > 500000000
        ORDER BY retorno_medio DESC
        LIMIT 1
     ) AS performer
    ) AS melhor_performer,
    (SELECT setor 
     FROM (
        SELECT setor, AVG(volatilidade_media) AS volatilidade_media
        FROM dashboard_kpi_setorial
        WHERE ano IN (
            SELECT ano FROM (
                SELECT DISTINCT ano 
                FROM dashboard_kpi_setorial 
                ORDER BY ano DESC 
                LIMIT 2
            ) AS anos
        )
        GROUP BY setor
        ORDER BY volatilidade_media DESC
        LIMIT 1
     ) AS volatilidade
    ) AS maior_volatilidade
FROM dashboard_kpi_setorial
WHERE ano IN (
    SELECT ano FROM (
        SELECT DISTINCT ano 
        FROM dashboard_kpi_setorial 
        ORDER BY ano DESC 
        LIMIT 2
    ) AS anos
);


--   EXEMPLO PARA 3 ANOS;
SELECT 
    COUNT(DISTINCT setor) AS total_setores,
    (SELECT setor 
     FROM (
        SELECT setor, AVG(retorno_medio) AS retorno_medio
        FROM dashboard_kpi_setorial
        WHERE ano IN (
            SELECT ano FROM (
                SELECT DISTINCT ano 
                FROM dashboard_kpi_setorial 
                ORDER BY ano DESC 
                LIMIT 3
            ) AS anos
        )
        GROUP BY setor
        HAVING AVG(retorno_medio) >= 10 
           AND AVG(preco_sobre_vp_medio) <= 1 
           AND AVG(valor_mercado_medio) > 500000000
        ORDER BY retorno_medio DESC
        LIMIT 1
     ) AS performer
    ) AS melhor_performer,
    (SELECT setor 
     FROM (
        SELECT setor, AVG(volatilidade_media) AS volatilidade_media
        FROM dashboard_kpi_setorial
        WHERE ano IN (
            SELECT ano FROM (
                SELECT DISTINCT ano 
                FROM dashboard_kpi_setorial 
                ORDER BY ano DESC 
                LIMIT 3
            ) AS anos
        )
        GROUP BY setor
        ORDER BY volatilidade_media DESC
        LIMIT 1
     ) AS volatilidade
    ) AS maior_volatilidade
FROM dashboard_kpi_setorial
WHERE ano IN (
    SELECT ano FROM (
        SELECT DISTINCT ano 
        FROM dashboard_kpi_setorial 
        ORDER BY ano DESC 
        LIMIT 3
    ) AS anos
);


--  									AINDA TELA DE SETORES, MAS AGORA VAI SER UMA VIEW PARA OS GRÁFICOS:

CREATE OR REPLACE VIEW dashboard_graficos AS
SELECT 
    e.setor,
    it.ano,    -- "Sharpe -> patrimonioLiquidoAcao"; " Liquidez ->precoSobreValorPatrimonial"
    AVG(it.rentabilidadeAnual) AS retorno_medio,
    AVG(it.patrimonioLiquidoAcao) AS patrimonioLiquidoAcao_medio, -- lugar do sharpe
    AVG(((a.precoMaisAlto - a.precoMaisBaixo) / a.precoAbertura) * 100) AS volatilidade_media,
    AVG(100 - ((a.precoMaisAlto - a.precoMaisBaixo) / a.precoAbertura) * 100) AS estabilidade_media,
    AVG(it.precoSobreValorPatrimonial) AS precoSobreValorPatrimonial_media, -- lugar do Liquidez
    COUNT(DISTINCT e.idEmpresa) AS num_acoes
FROM infoTemporal it
INNER JOIN empresa e ON it.fkEmpresa = e.idEmpresa
INNER JOIN acoes a ON a.fkEmpresa = e.idEmpresa AND YEAR(a.dtAtual) = it.ano
GROUP BY e.setor, it.ano;


-- GRÁFICO Multidimensional - Radar
-- Para 1 ano
SELECT 
    setor,
    AVG(retorno_medio) AS retorno,
    AVG(estabilidade_media) AS estabilidade,
    AVG(precoSobreValorPatrimonial_media) AS precoSobreValorPatrimonial,
    AVG(patrimonioLiquidoAcao_medio) AS patrimonioLiquidoAcao
FROM dashboard_graficos
WHERE ano = 2024
GROUP BY setor LIMIT 3;

-- Para 2 anos
SELECT 
    setor,
    AVG(retorno_medio) AS retorno,
    AVG(estabilidade_media) AS estabilidade,
    AVG(precoSobreValorPatrimonial_media) AS precoSobreValorPatrimonial,
    AVG(patrimonioLiquidoAcao_medio) AS sharpe
FROM dashboard_graficos
WHERE ano IN (2023, 2024)
GROUP BY setor LIMIT 3;

-- Para 3 anos
SELECT 
    setor,
    AVG(retorno_medio) AS retorno,
    AVG(estabilidade_media) AS estabilidade,
    AVG(precoSobreValorPatrimonial_media) AS precoSobreValorPatrimonial,
    AVG(patrimonioLiquidoAcao_medio) AS patrimonioLiquidoAcao
FROM dashboard_graficos
WHERE ano IN (2022, 2023, 2024)
GROUP BY setor LIMIT 3;


-- GRÁFICO DE BARRAS (RETORNO E VOLATIBILIDADE)

-- Para 1 ano
SELECT 
    setor,
    AVG(retorno_medio) AS retorno,
    AVG(volatilidade_media) AS volatilidade
FROM dashboard_graficos
WHERE ano = 2024
GROUP BY setor
ORDER BY retorno DESC;

-- Para 2 anos
SELECT 
    setor,
    AVG(retorno_medio) AS retorno,
    AVG(volatilidade_media) AS volatilidade
FROM dashboard_graficos
WHERE ano IN (2023, 2024)
GROUP BY setor
ORDER BY retorno DESC;

-- Para 3 anos
SELECT 
    setor,
    AVG(retorno_medio) AS retorno,
    AVG(volatilidade_media) AS volatilidade
FROM dashboard_graficos
WHERE ano IN (2022, 2023, 2024)
GROUP BY setor
ORDER BY retorno DESC;



-- 													TELA AÇÕES 

CREATE OR REPLACE VIEW dashboard_acoes AS
SELECT 
    e.idEmpresa,
    e.nome,
    e.ticker,
    e.setor,
    it.rentabilidadeAnual,
    it.precoSobreValorPatrimonial,
    it.patrimonioLiquidoAcao,
    ((a.precoMaisAlto - a.precoMaisBaixo) / a.precoAbertura) * 100 AS volatilidade,
    it.ano
FROM infoTemporal it
INNER JOIN empresa e ON it.fkEmpresa = e.idEmpresa
INNER JOIN acoes a ON a.fkEmpresa = e.idEmpresa AND YEAR(a.dtAtual) = it.ano
WHERE it.ano = (SELECT MAX(ano) FROM infoTemporal);


-- AÇÕES RECOMENDADAS:
-- Para todos os setores
SELECT COUNT(*) AS acoes_recomendadas
FROM dashboard_acoes
WHERE precoSobreValorPatrimonial <= 1 OR rentabilidadeAnual > 15;

-- Para um setor específico
SELECT COUNT(*) AS acoes_recomendadas
FROM dashboard_acoes
WHERE setor = 'Tecnologia' AND (precoSobreValorPatrimonial <= 1 OR rentabilidadeAnual > 15); -- AKI É SÓ MUDAR O SETOR E BOA


-- RETORNO MÉDIO
-- Todos os setores
SELECT AVG(rentabilidadeAnual) AS retorno_medio
FROM dashboard_acoes;

-- Por setor
SELECT AVG(rentabilidadeAnual) AS retorno_medio
FROM dashboard_acoes
WHERE setor = 'Tecnologia';


-- VOLATILIDADE MÉDIA:
-- Todos os setores
SELECT AVG(volatilidade) AS volatilidade_media
FROM dashboard_acoes;

-- Por setor
SELECT AVG(volatilidade) AS volatilidade_media
FROM dashboard_acoes
WHERE setor = 'Tecnologia';

-- P/E MÉDIO:
-- Todos os setores
SELECT AVG(patrimonioLiquidoAcao) AS pe_medio
FROM dashboard_acoes;

-- Por setor
SELECT AVG(patrimonioLiquidoAcao) AS pe_medio
FROM dashboard_acoes
WHERE setor = 'Tecnologia';

-- 				AINDA NA TELA DE AÇÕES, MAS PPASSANDO PARA A PARTE DOS GRÁFICOS

-- GRÁFICO EVOLUÇÃO COM O TEMPO
CREATE VIEW evolucao_preco_2024 AS
SELECT 
    e.nome AS acao,
    e.ticker,
    MONTH(a.dtAtual) AS mes,
    AVG(a.precoFechamento) AS preco_medio_mensal
FROM acoes a
INNER JOIN empresa e ON a.fkEmpresa = e.idEmpresa
WHERE YEAR(a.dtAtual) = 2024
GROUP BY e.idEmpresa, e.nome, e.ticker, MONTH(a.dtAtual)
ORDER BY e.nome, mes;

SELECT mes, preco_medio_mensal
FROM evolucao_preco_2024
WHERE ticker = 'AAPL'  -- ticker desejado, não sei se vai fazer com que o usuário escolha... se não talvez podemos pegar o que tenha a maior rentabilidade, ou algo assim.
ORDER BY mes;

-- VIEW PARA OS DADOS NAS KPI's
CREATE OR REPLACE VIEW dados_acoes_atual AS
SELECT 
    e.nome AS acao,
    e.ticker,
    e.setor,
    a.precoFechamento AS preco_atual,
    it.rentabilidadeAnual AS retorno,
    it.patrimonioLiquidoAcao AS patrimonioLiquidoAcao,
    it.DRE AS DRE,
    a.volume,
    a.dtAtual AS data_atualizacao
FROM empresa e
INNER JOIN infoTemporal it ON e.idEmpresa = it.fkEmpresa
INNER JOIN acoes a ON e.idEmpresa = a.fkEmpresa
WHERE it.ano = 2024
AND a.dtAtual = (SELECT MAX(dtAtual) FROM acoes WHERE fkEmpresa = e.idEmpresa AND YEAR(dtAtual) = 2024);

SELECT 
    acao,
    setor,
    preco_atual,
    retorno,
    patrimonioLiquidoAcao,
    DRE,
    volume
FROM dados_acoes_atual
WHERE ticker = 'HEAL5';

-- 						AGORA PARA TELA DE COMPARAÇÃO:
CREATE OR REPLACE VIEW comparacao_acoes AS
SELECT 
    e.ticker,
    e.nome AS acao,
    e.setor,
    it.rentabilidadeAnual AS retorno,
    ((a.precoMaisAlto - a.precoMaisBaixo) / a.precoAbertura) * 100 AS volatilidade,
    it.pratrimonioLiquido AS patrimonioLiquido, -- era Max_drawndown
    it.patrimonioLiquidoAcao AS patrimonioLiquidoAcao, -- era Sharpe
    it.precoSobreValorPatrimonial AS liquidez,
    it.DRE AS DRE,
    it.EBITDA AS EBITDA,
    it.patrimonioLiquidoAcao AS pe_ratio,
    a.precoFechamento,
    a.dtAtual
FROM empresa e
INNER JOIN infoTemporal it ON e.idEmpresa = it.fkEmpresa
INNER JOIN acoes a ON e.idEmpresa = a.fkEmpresa
WHERE it.ano = 2024;

select * from empresa;
-- KPIs para ações específicas
SELECT 
    ticker,
    acao,
    setor,
    retorno,
    volatilidade,
    patrimonioLiquido
FROM comparacao_acoes
WHERE ticker IN ('HEAL5', 'ENG4', 'INDI6')
AND dtAtual = (SELECT MAX(dtAtual) FROM comparacao_acoes WHERE ticker IN ('HEAL5', 'ENG4', 'INDI6'));


-- Gráfico Multidimensional (Radar):
SELECT 
    ticker,
    retorno,
    (100 - volatilidade) AS estabilidade,
    patrimonioLiquidoAcao,
    liquidez
FROM comparacao_acoes
WHERE ticker IN ('HEAL5', 'ENG4', 'INDI6')
AND dtAtual = (SELECT MAX(dtAtual) FROM comparacao_acoes WHERE ticker IN ('HEAL5', 'ENG4', 'INDI6'));

-- GRÁFICO RETORNO P/E:
SELECT 
    ticker,
    retorno,
    pe_ratio
FROM comparacao_acoes
WHERE ticker IN ('AAPL', 'GOOGL', 'MSFT', 'JNJ')
AND dtAtual = (SELECT MAX(dtAtual) FROM comparacao_acoes WHERE ticker IN ('AAPL', 'GOOGL', 'MSFT', 'JNJ'));

-- GRÁFICO SHARPE E BETA: -- que vai virar DRE E EBITIDA
SELECT 
    ticker,
    EBITDA,
    DRE
FROM comparacao_acoes
WHERE ticker IN ('HEAL5', 'ENG4', 'INDI6')
AND dtAtual = (SELECT MAX(dtAtual) FROM comparacao_acoes WHERE ticker IN ('HEAL5', 'ENG4', 'INDI6'));


-- GRÁFICO EVOLUÇÃO DE PREÇOS MENSAL:
SELECT 
    ticker,
    MONTH(dtAtual) AS mes,
    AVG(precoFechamento) AS preco_medio_mensal
FROM comparacao_acoes
WHERE ticker IN ('HEAL5', 'ENG4', 'INDI6')
AND YEAR(dtAtual) = 2024
GROUP BY ticker, MONTH(dtAtual)
ORDER BY ticker, mes;

 -- -------- PARA TER UMA NOÇÃO MELHOR, ESSA É A VIEW QUE SERVE PARA DIFERENCIAR OS PERFIS DE USUÁRIO, USAREI ELA COMO BASE PARA MODIFICAR AS OUTRAS VIEWS; ESTOU FAZENDO TESTES AINDA.
 
 CREATE OR REPLACE VIEW acoes_com_perfil AS
SELECT 
    e.ticker,
    e.nome,
    e.setor,
    it.rentabilidadeAnual,
    it.DRE,
    ((a.precoMaisAlto - a.precoMaisBaixo) / a.precoAbertura) * 100 AS volatilidade,
    it.EBITDA,
    it.precoSobreValorPatrimonial,
    it.patrimonioLiquidoAcao,
    -- CLASSIFICAÇÕES POR PERFIL
    CASE 
        WHEN ((a.precoMaisAlto - a.precoMaisBaixo) / a.precoAbertura) * 100 < 15 
             AND it.precoSobreValorPatrimonial <= 1 THEN 'CONSERVADOR'
        WHEN ((a.precoMaisAlto - a.precoMaisBaixo) / a.precoAbertura) * 100 BETWEEN 15 AND 25 
             AND it.rentabilidadeAnual BETWEEN 8 AND 20 THEN 'MODERADO'
        WHEN it.rentabilidadeAnual > 15 
             AND ((a.precoMaisAlto - a.precoMaisBaixo) / a.precoAbertura) * 100 > 25 THEN 'ARROJADO'
        ELSE 'NEUTRO'
    END AS perfil_recomendado
FROM empresa e
INNER JOIN infoTemporal it ON e.idEmpresa = it.fkEmpresa
INNER JOIN acoes a ON a.fkEmpresa = e.idEmpresa AND YEAR(a.dtAtual) = it.ano
WHERE it.ano = (SELECT MAX(ano) FROM infoTemporal);
select nome, ticker, perfil_recomendado from acoes_com_perfil;
select nome, ticker, perfil_recomendado from acoes_com_perfil where perfil_recomendado = 'MODERADO';

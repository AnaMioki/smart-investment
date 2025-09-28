-- Arquivo de apoio, caso você queira criar tabelas como as aqui criadas para a API funcionar.
-- Você precisa executar os comandos no banco de dados para criar as tabelas,
-- ter este arquivo aqui não significa que a tabela em seu BD estará como abaixo!

/*
comandos para mysql server
*/


CREATE DATABASE smart_investment;
USE smart_investment;

CREATE TABLE usuario (
idUsuario INT PRIMARY KEY AUTO_INCREMENT,
nome VARCHAR(70) NOT NULL,
dtNascimento DATE,
email VARCHAR(60) NOT NULL,
senha VARCHAR(20) NOT NULL,
perfil VARCHAR(20),
	CONSTRAINT ckPerfil 
		CHECK (perfil IN ('Conservador', 'Moderado', 'Arrojado'))
);

CREATE TABLE empresa (
idEmpresa INT PRIMARY KEY AUTO_INCREMENT,
nome VARCHAR(80) NOT NULL,
ticker VARCHAR(10) NOT NULL,
setor VARCHAR(30) NOT NULL
);

CREATE TABLE acoes (
idAcoes INT PRIMARY KEY AUTO_INCREMENT,
dtAtual DATE NOT NULL,
precoAbertura DOUBLE NOT NULL,
precoFechamento DOUBLE NOT NULL,
precoMaisAlto DOUBLE NOT NULL,
precoMaisBaixo DOUBLE NOT NULL,
volume DOUBLE NOT NULL,
fkEmpresa INT NOT NULL,
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
CONSTRAINT ckTipoNotificacoes
		CHECK (tipo IN ('Ação sugerida', 'Ação Favoritada', 'Alerta')),
mensagem VARCHAR(255),
fkAcoes INT NOT NULL,
CONSTRAINT fkAcoesFavoritadas FOREIGN KEY (fkAcoes) REFERENCES acoes(idAcoes),
fkUsuario INT NOT NULL,
CONSTRAINT fkUsuarioAcoesFavoritadas FOREIGN KEY (fkUsuario) REFERENCES usuario(idUsuario)
);

CREATE TABLE log (
idLog INT PRIMARY KEY AUTO_INCREMENT,
tipo VARCHAR(255),
CONSTRAINT ckTipoLog
		CHECK (tipo IN ('Sucesso', 'Alerta', 'Erro')),
dtLog DATETIME NOT NULL,
mensagemErro VARCHAR(80)
);














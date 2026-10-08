CREATE DATABASE chemphys;

USE chemphys;

CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(10) NOT NULL
);

CREATE TABLE conteudo (
    id_conteudo INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    materia VARCHAR(50) NOT NULL,
    assunto VARCHAR(100) NOT NULL,
    texto TEXT NOT NULL
);

create table calculadora(
id_calculadora int not null primary key auto_increment,
nome_calculo varchar(100)not null,
materia varchar(10)not null,
formula varchar(70)not null,
resultado decimal(10,2) not null
);

create table trilha(
id_trilha int not null primary key auto_increment,
titulo varchar(100)not null,
descricao varchar(250)not null,
data_criacao datetime not null
);

create table historico(
id_historico int not null primary key auto_increment,
id_calculadora int not null,
nome_calculo varchar(100)not null,
materia varchar(10)not null,
foreign key(id_calculadora)references calculadora(id_calculadora)
);

create table favoritos(
id_favoritos int not null primary key auto_increment,
id_usuario int not null,
id_conteudo int not null,
id_calculadora int not null,
id_trilha int not null,
UNIQUE(id_usuario,id_conteudo,id_calculadora,id_trilha),
foreign key(id_usuario)references usuario(id_usuario),
foreign key(id_conteudo)references conteudo(id_conteudo),
foreign key(id_calculadora)references calculadora(id_calculadora),
foreign key(id_trilha)references trilha(id_trilha)
);
-- 1º - Criação do banco de dados:

CREATE DATABASE dindin;


-- 2º - Criação da tabela usuários:

CREATE TABLE usuarios (
    id serial primary key,
    nome text not null,
    email text not null unique,
    senha text not null
);

-- 3º - Criação da tabela categorias:

CREATE TABLE categorias (
    id serial primary key,
    descricao text not null
);

-- 4º - Criação da tabela transacoes:

CREATE TABLE transacoes (
    id serial primary key,
    descricao text not null,
    valor integer not null,
    data timestamp,
    categoria_id integer references categorias(id) ON DELETE SET NULL,
    usuario_id integer references usuarios(id) ON DELETE CASCADE,
    tipo text not null
);


-- 5º - Adicionar todas as categorias na tabela categorias:


INSERT INTO categorias 
	(descricao)
VALUES
	('Alimentação'),
    ('Assinaturas e Serviços'),
    ('Casa'),
    ('Mercado'),
    ('Cuidados Pessoais'),
    ('Educação'),
    ('Família'),
    ('Lazer'),
    ('Pets'),
    ('Presentes'),
    ('Roupas'),
    ('Saúde'),
    ('Transporte'),
    ('Salário'),
    ('Vendas'),
    ('Outras receitas'),
    ('Outras despesas')


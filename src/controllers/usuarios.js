const pool = require('../conexao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../configs')


const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;

    if(!nome) {
        return res.status(403).json({ mensagem: "Campo nome obrigatório" })
    }

    if(!email) {
        return res.status(403).json({ mensagem: "Campo e-mail obrigatório" })
    }

    if (!senha) {
        return res.status(403).json({ mensagem: "Campo senha obrigatório" })
    }

    try {
        const verificarEmailExistente = await pool.query(
            'SELECT * FROM usuarios WHERE email = $1',[email]
        );

        if(verificarEmailExistente.rows.length > 0) {
            return res.status(403).json({ mensagem: "E-mail já cadastrado" })
        };

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const novoUsuario = await pool.query(
            'INSERT INTO usuarios (nome, email, senha) values ($1, $2, $3) returning *', 
            [nome, email, senhaCriptografada]
        );


        const { id, nome: nomeUsuario, email: emailUsuario } = novoUsuario.rows[0];
        const usuarioResposta = { id, nome: nomeUsuario, email: emailUsuario };


        return res.status(201).json(usuarioResposta);
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
};


const loginUsuario = async (req, res) => {
    const { email, senha } = req.body;

    if(!email) {
        return res.status(403).json({ mensagem: "Campo e-mail obrigatório" })
    }

    if (!senha) {
        return res.status(403).json({ mensagem: "Campo senha obrigatório" })
    }

    try {
        const usuario = await pool.query(
            'SELECT * FROM usuarios WHERE email = $1',
            [email]
        );

        if (usuario.rowCount < 1) {
            return res.status(403).json({ mensagem: "E-mail ou senha inválido" })
        };

        const validadorSenha = await bcrypt.compare(senha, usuario.rows[0].senha);

        if (!validadorSenha) {
            return res.status(403).json({ mensagem: "E-mail ou senha inválido" });
        }

        const token = jwt.sign({ id: usuario.rows[0].id }, jwtSecret, {expiresIn: '4h'})

        const { id, nome: nomeUsuario, email: emailUsuario } = usuario.rows[0];
        const usuarioResposta = { id, nome: nomeUsuario, email: emailUsuario };


        return res.status(200).json({usuario: usuarioResposta, token});


    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }


};


const detalharPerfilLogado = async (req, res) => {
    const { id, nome, email } = req.usuario;
    return res.status(200).json({id, nome, email});
}


const editarPerfilLogado = async (req, res) => {
    const { nome, email, senha } = req.body;
    const usuarioId = req.usuario.id;

    if(!nome) {
        return res.status(403).json({ mensagem: "Campo nome obrigatório" })
    }

    if(!email) {
        return res.status(403).json({ mensagem: "Campo e-mail obrigatório" })
    }

    if (!senha) {
        return res.status(403).json({ mensagem: "Campo senha obrigatório" })
    }

    try {

        const verificarEmailExistente = await pool.query(
            'SELECT * FROM usuarios WHERE email = $1 AND id <> $2',[email, usuarioId]
        );

        if(verificarEmailExistente.rows.length > 0) {
            return res.status(403).json({ mensagem: "E-mail já cadastrado" })
        };

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const atualizarUsuario = await pool.query(
            'UPDATE usuarios SET nome = $1, email = $2, senha = $3 WHERE id = $4', 
            [nome, email, senhaCriptografada, req.usuario.id]
        );

        return res.status(200).json({})



    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
};


const listarCategorias = async (req, res) => {
    try {

        const listaCategoria = await pool.query(
            'SELECT * FROM categorias'
        );

        return res.status(200).json(listaCategoria.rows);

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
};


module.exports = {
    cadastrarUsuario,
    loginUsuario,
    detalharPerfilLogado,
    editarPerfilLogado,
    listarCategorias
}
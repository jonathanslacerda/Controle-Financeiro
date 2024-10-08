const jwt = require('jsonwebtoken');
const pool = require('../conexao');
const { jwtSecret } = require('../configs');

const validacaoUsuario = async (req, res, next) => {
    const { authorization } = req.headers

    if(!authorization) {
        return res.status(401).json({ mensagem: "Usuário não autorizado" })
    }


    const splitToken = authorization.split(' ')[1]


    try {
        const { id } = jwt.verify(splitToken, jwtSecret)

        const { rows, rowCount} = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);

        if (rowCount < 1) {
            return res.status(404).json({ mensagem: "Usuário não encontrado" })
        };

        req.usuario = rows[0];


        next();
    } catch (error) {
        return res.status(401).json({ mensagem: "Usuário não autorizado" })
    }
};

module.exports = validacaoUsuario;
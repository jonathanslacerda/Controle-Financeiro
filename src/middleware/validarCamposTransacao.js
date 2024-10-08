const pool = require('../conexao');

const validarCamposTransacao= async (req, res,next) => {
    const {tipo,descricao, valor, data,categoria_id} = req.body
    if(!descricao || !valor || !data || !categoria_id || !tipo ) {
        return res.status(403).json({ mensagem: "Todos os campos são obrigatorios" })
    }

    try {
        const verificarCategoria = await pool.query(
            'SELECT * FROM categorias WHERE id = $1',[categoria_id],
            );

        if(verificarCategoria.rows.length === 0) {
            return res.status(403).json({ mensagem: "A categoria informada não existe." })
        };
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro ao verificar categoria" });
    }

    if(tipo != "entrada" && tipo != "saida") {
        return res.status(403).json({ mensagem: "O tipo de transação está incorreto." })
    };
    next()

}
module.exports = validarCamposTransacao
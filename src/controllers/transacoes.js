const pool = require('../conexao');


const listarTransacoes = async (req, res) => {
    const {id} = req.usuario
    try {
        const {rows} = await pool.query('select * from transacoes where usuario_id = $1', [id])
        
        return res.json(rows)
    
    } catch (error) {
        return res.status(400).json({mensagem:'Erro ao listar transacoes do usuario'})
    }
};


const detalharTransacao = async (req, res) => {
    const idTransacao = req.params.id
    const idTransacaoInt = parseInt(idTransacao, 10);

    const usuario_id = req.usuario.id;

    const detalharTransacao = await pool.query(
        'SELECT * FROM transacoes WHERE id = $1 AND usuario_id = $2', [idTransacao, usuario_id]
    );

    if(detalharTransacao.rows.length === 0) {
        return res.status(403).json({mensagem: "Não foi encontrada nenhuma transação."});
    }

    return res.status(200).json(detalharTransacao.rows[0]);
};

const cadastrarTransacao = async (req, res) => {
    const usuario_id = req.usuario.id;
    const {tipo,descricao, valor, data,categoria_id} = req.body
    try {
        const query = 'INSERT INTO transacoes (usuario_id, tipo, descricao, valor, data, categoria_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
        const params = [usuario_id, tipo, descricao, valor, data, categoria_id];
        const { rows } = await pool.query(query, params);
        return res.status(201).json(rows[0]);
    } catch (error) {
        res.status(500).json({ mensagem: "Erro interno de serivdor" })
    }
};

const editarTransacao = async (req, res) => {
    const idTransacao = req.params.id
    const idTransacaoInt = parseInt(idTransacao, 10);
    const {tipo,descricao, valor, data,categoria_id} = req.body
    const usuario_id = req.usuario.id;

   try {
        const transacao = await pool.query(
            'SELECT * FROM transacoes WHERE id = $1 AND usuario_id = $2', [idTransacaoInt, usuario_id]
        );

        if(transacao.rows.length === 0) {
            return res.status(403).json({mensagem: "Não foi encontrada nenhuma transacao com o ID informado."});
        }

        const atualizarTransacao = await pool.query(
            'UPDATE transacoes SET tipo = $1, descricao = $2, valor = $3, data = $4, categoria_id = $5 WHERE id = $6 AND usuario_id = $7 RETURNING *', 
            [tipo, descricao, valor, data, categoria_id, idTransacaoInt, usuario_id]
        );
        
        return res.status(201).json(atualizarTransacao.rows[0]);
    
    } catch (error) {
        res.status(500).json({ mensagem: "Erro interno de servidor" })
    }

};

const removerTransacao = async (req, res) => {
    const idTransacao = req.params.id
    const idTransacaoInt = parseInt(idTransacao, 10);
    const usuario_id = req.usuario.id

    try {
        const deletarTransacao = await pool.query('DELETE FROM transacoes WHERE usuario_id = $1 AND id = $2', [usuario_id,idTransacao]);

        if (deletarTransacao.rowCount === 0) {
            return res.status(404).json({ mensagem: 'Transação não encontrada' });
        }

        return res.status(200).json({ mensagem: 'Transação deletada com sucesso' });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ mensagem: 'Erro ao deletar transação' });
    }
    
};

const extratoTransacoes = async (req, res) => {
    const usuario_id = req.usuario.id;
    try {
        const entradasSoma = await pool.query('SELECT SUM(valor) AS entradas FROM transacoes WHERE usuario_id = $1 AND tipo = $2', [usuario_id, 'entrada'])
        const saidasSoma = await pool.query('SELECT SUM(valor) AS saidas FROM transacoes WHERE usuario_id = $1 AND tipo = $2', [usuario_id, 'saida'])
        
        const entradas = entradasSoma.rows[0].entradas || 0;
        const saidas = saidasSoma.rows[0].saidas || 0;
        
        
        return res.json({entradas,saidas})
    
    } catch (error) {
        return res.status(400).json({mensagem:'Erro ao listar extrato de transacões'})
    }

};

const filtrarPorCategoria = async (req, res) => {

};


module.exports = {
    listarTransacoes,
    detalharTransacao,
    cadastrarTransacao,
    editarTransacao,
    removerTransacao,
    extratoTransacoes,
    filtrarPorCategoria
}
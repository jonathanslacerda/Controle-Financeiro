const express = require('express');
const {cadastrarUsuario, detalharPerfilLogado, loginUsuario, editarPerfilLogado, listarCategorias } = require('../controllers/usuarios');
const {listarTransacoes, detalharTransacao, cadastrarTransacao, editarTransacao, removerTransacao, extratoTransacoes, filtrarPorCategoria} = require('../controllers/transacoes');
const validacaoUsuario = require('../middleware/intermediarios');
const validarTransacao = require('../middleware/validarCamposTransacao');
const validarCamposTransacao = require('../middleware/validarCamposTransacao');
const rotas = express();



rotas.post('/usuario', cadastrarUsuario);
rotas.post('/login', loginUsuario);


rotas.use(validacaoUsuario);

rotas.get('/usuario', detalharPerfilLogado);
rotas.put('/usuario', editarPerfilLogado);
rotas.get('/categoria', listarCategorias)
rotas.get('/transacao', listarTransacoes);
rotas.get('/transacao/extrato', extratoTransacoes);
rotas.get('/transacao/:id', detalharTransacao);
rotas.post('/transacao', validarCamposTransacao, cadastrarTransacao);
rotas.put('/transacao/:id', validarCamposTransacao, editarTransacao);
rotas.delete('/transacao/:id', removerTransacao);

module.exports = rotas;
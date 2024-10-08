const express = require('express');
const rotas = require('./routers/rotas');
const { serverPort } = require('./configs')
const app = express();

app.use(express.json());
app.use(rotas);
app.listen(serverPort, () => {
    console.log(`Servidor rodando da porta ${serverPort}`)
});
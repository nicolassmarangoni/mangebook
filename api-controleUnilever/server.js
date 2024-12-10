// arquivo principal da api
// inicia o servidor
require('dotenv').config(); // Carrega as variáveis do arquivo .env
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// inicialização do app
const app = express();
app.use(cors());
app.use(express.json()); // Para analisar JSON no corpo das requisições

const authRoutes = require('./Routes/authRoutes');
const bookRoutes = require('./Routes/books'); 

// Conexão com o MongoDB
mongoose.connect('mongodb+srv://nicolasmpontes:12345@cluster0.fpy2o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Mongodb conectado')).catch(err => console.error('Erro ao conectar no mongo', err));

// Importação das rotas
app.use('/api/livros', bookRoutes); 
app.use('/api/auth', authRoutes);

// Define a porta do servidor
app.listen(5000, () => {
    console.log('Servidor executando na porta 5000');
});

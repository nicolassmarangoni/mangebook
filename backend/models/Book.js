const mongoose = require('mongoose');

// Definindo o Schema para o modelo de livro
const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  year: { type: Number },
  image: { type: String } // Campo para armazenar o caminho da imagem
});

// Criando o modelo a partir do Schema
const Book = mongoose.model('Book', BookSchema);

// Exportando o modelo para uso em outras partes da aplicação
module.exports = Book;
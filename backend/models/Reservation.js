const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,  // Tipo ObjectId para referenciar um usuário
    ref: 'User',  // Referência ao modelo de usuário (assumindo que você tem um modelo de usuário)
    required: true  // Esse campo é obrigatório
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,  // Tipo ObjectId para referenciar um livro
    ref: 'Book',  // Referência ao modelo de livro
    required: true  // Esse campo também é obrigatório
  },
  reservedAt: {
    type: Date,  // Tipo Date para armazenar a data da reserva
    default: Date.now  // Se não for passado um valor, o valor padrão será a data atual
  }
});

// Criando o modelo Reservation com base no schema
const Reservation = mongoose.model('Reservation', reservationSchema);

// Exportando o modelo
module.exports = Reservation;

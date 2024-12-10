const express = require('express');
const Reservation = require('../models/Reservation'); // Modelo de Reserva
const Book = require('../models/Book'); // Modelo de Livro
const router = express.Router();

// *** Rota para verificar se o livro está reservado ***
router.get('/:bookId', async (req, res) => {
    const { bookId } = req.params;

    try {
        // Verificar se o livro existe
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Livro não encontrado' });
        }

        // Verificar se o livro já está reservado
        const existingReservation = await Reservation.findOne({ bookId });
        if (existingReservation) {
            return res.status(200).json({ reserved: true });  // Livro está reservado
        } else {
            return res.status(200).json({ reserved: false }); // Livro não está reservado
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao verificar a reserva', error });
    }
});

// *** Rota de Reserva de Livro ***
router.post('/', async (req, res) => {
    const { bookId, userId } = req.body;  // Recebe tanto bookId quanto userId do corpo da requisição

    if (!userId) {
        return res.status(400).json({ message: 'UserId não fornecido.' });
    }

    try {
        // Validar se o livro existe
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Livro não encontrado' });
        }

        // Verificar se o livro já está reservado (verifica qualquer reserva ativa)
        const existingReservation = await Reservation.findOne({ bookId });
        if (existingReservation) {
            return res.status(400).json({ message: 'Este livro já está reservado.' });
        }

        // Criação de uma nova reserva (associando a reserva ao livro e ao usuário)
        const newReservation = new Reservation({
            bookId,
            userId,        // Associando o userId à reserva
            reservedAt: new Date(),
        });

        // Salvar a reserva no banco
        await newReservation.save();

        // Retornar as informações do livro juntamente com a reserva
        res.status(201).json({
            message: 'Livro reservado com sucesso',
            reservation: newReservation,
            book: {
                _id: book._id,
                title: book.title,
                author: book.author,
                year: book.year
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao reservar o livro', error });
    }
});

// *** Rota de Cancelamento de Reserva ***
router.delete('/cancelar', async (req, res) => {
    const { bookId, userId } = req.body;

    if (!userId) {
        return res.status(400).json({ message: 'UserId não fornecido.' });
    }

    try {
        // Encontrar a reserva existente para o livro e o usuário
        const existingReservation = await Reservation.findOne({ bookId, userId });

        if (!existingReservation) {
            return res.status(404).json({ message: 'Reserva não encontrada para este livro.' });
        }

        // Remover a reserva
        await Reservation.deleteOne({ _id: existingReservation._id });

        res.status(200).json({ message: 'Reserva cancelada com sucesso.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao cancelar a reserva', error });
    }
});

module.exports = router;

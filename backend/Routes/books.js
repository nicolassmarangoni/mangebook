const express = require('express');
const Book = require('../models/Book'); // Fixed path and casing
const router = express.Router();

//*** criação (POST) */
router.post('/', async (req, res) => {
    const { title, author, year } = req.body;
    try {
        const newBook = new Book({ title, author, year });
        await newBook.save();
        res.status(201).json(newBook);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar livro', error });
    }
});

//*** leitura (GET) */
router.get('/', async (req, res) => {
    try {
      const books = await Book.find(); // Buscamos todos os livros
      res.status(200).json(books); // Retornamos a lista de livros
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar livros', error }); // Retornamos erro, se houver
    }
  });

//** atualização (PUT) */
router.put('/:id', async (req, res) => {
    const { title, author, year } = req.body;
    try {
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, { title, author, year }, { new: true });
        if (!updatedBook) {
            return res.status(404).json({ message: 'Livro não encontrado' });
        }
        res.status(200).json(updatedBook);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar o livro', error });
    }
});

//** deleção (DELETE) */
router.delete('/:id', async (req, res) => { // Fixed method name
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id); // Fixed method to delete
        if (!deletedBook) {
            return res.status(404).json({ message: 'Livro não encontrado' });
        }
        res.status(200).json({ message: 'Livro deletado com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar livro', error });
    }
});



module.exports = router;

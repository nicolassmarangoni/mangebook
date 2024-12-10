const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

// Configurações do Express
const app = express();
app.use(express.json());
app.use(cors());  // Permitir requisições de outros domínios (principalmente se o frontend e backend estiverem em portas diferentes)

// Configuração do Multer para upload de imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Diretório onde as imagens serão salvas
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nome único para o arquivo
  },
});

// Filtro para garantir que apenas imagens sejam aceitas
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true); // Aceita imagens
  } else {
    cb(new Error('Somente imagens são permitidas!'), false); // Rejeita outros tipos
  }
};

// Inicializando o Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

// Conectando ao MongoDB
mongoose.connect('mongodb+srv://nicolasmpontes:12345@cluster0.fpy2o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB conectado'))
  .catch((err) => console.error('Erro de conexão com o MongoDB', err));

// Importando o modelo de Livro
const Book = require('../models/Book'); // Certifique-se de que o caminho do modelo está correto
const router = require('./authRoutes');

// Rotas

// Rota para adicionar um livro (incluindo a imagem)
app.post('/api/livros', upload.single('image'), async (req, res) => {
    if (req.fileValidationError) {
      return res.status(400).json({ error: req.fileValidationError });
    }
  
    const { title, author, year } = req.body;
  
    if (!title || !author || !year) {
      return res.status(400).json({ error: 'Título, autor e ano são obrigatórios.' });
    }
  
    const image = req.file ? req.file.path : null;
  
    try {
      // Criando o livro
      const newBook = new Book({
        title,
        author,
        year,
        image,
      });
  
      // Salvando o livro no MongoDB
      await newBook.save();
  
      // Respondendo com o livro criado
      res.status(201).json(newBook);
    } catch (error) {
      console.error('Erro ao adicionar livro:', error);
      res.status(500).json({ error: 'Erro ao adicionar o livro' });
    }
  });

// Rota para listar todos os livros
app.get('/api/livros', async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar livros' });
  }
});

// Rota para excluir um livro
app.delete('/api/livros/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ error: 'Livro não encontrado' });

    res.status(200).json({ message: 'Livro excluído com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao excluir o livro' });
  }
});

// Rota para atualizar um livro
app.put('/api/livros/:id', upload.single('image'), async (req, res) => {
  try {
    const { title, author, year } = req.body;

    // Verificar se os campos obrigatórios estão presentes
    if (!title || !author) {
      return res.status(400).json({ error: 'Título e autor são obrigatórios.' });
    }

    // Atualizando o livro
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id, // Identificador do livro
      {
        title,
        author,
        year,
        image: req.file ? req.file.path : req.body.image, // Atualiza o caminho da imagem se um novo arquivo foi enviado
      },
      { new: true } // Retorna o documento atualizado
    );

    if (!updatedBook) return res.status(404).json({ error: 'Livro não encontrado' });

    res.status(200).json(updatedBook);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar o livro' });
  }
});

// Servindo arquivos estáticos da pasta 'uploads'
app.use('/uploads', express.static('uploads'));

// Inicializando o servidor na porta 5000
const PORT = process.env.PORT || 3000; // Usando variável de ambiente para a porta
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = router
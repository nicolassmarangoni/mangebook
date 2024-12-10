const express = require('express');
const Product = require('../models/ativo');
const router = express.Router();

// Middleware para analisar o corpo da requisição
router.use(express.json());

// Rota para cadastrar um novo produto (POST)
router.post('/', async (req, res) => {
    const { nome, quantidade, tipo, lote , id_ativo} = req.body;

    try {
        const newProduct = new Product({ nome, quantidade, tipo, lote, id_ativo });
        await newProduct.save();

        res.status(201).json(newProduct); // 201 - Produto criado
    } catch (error) {
        console.error('Erro ao cadastrar ativo:', error);
        res.status(500).json({ message: 'Erro ao cadastrar ativo', error });
    }
});

// Rota para buscar todos os produtos (GET)
router.get('/produtos', async (req, res) => {
    try {
      const { dataInicial, dataFinal } = req.query;
      
      if (!dataInicial || !dataFinal) {
        return res.status(400).json({ message: 'Data inicial e data final são obrigatórias.' });
      }
  
      const produtos = await Product.find({
        dataEnvio: {
          $gte: new Date(dataInicial),
          $lte: new Date(dataFinal)
        }
      });
  
      res.json(produtos);
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      res.status(500).json({ message: 'Erro ao gerar relatório' });
    }
  });
  
  module.exports = router;
  
// Rota para atualizar um produto (PUT)
router.put('/:id', async (req, res) => {
    const { nome, quantidade, valor, lote, id_ativo } = req.body;

    if (!req.params.id) {
        return res.status(400).json({ message: 'ID do produto é necessário.' });
    }

    if (!nome || quantidade === undefined || valor === undefined || !lote) {
        return res.status(400).json({ message: 'Campos nome, quantidade, valor e lote são obrigatórios.' });
    }

    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { nome, quantidade, valor, lote, id_ativo },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Produto não encontrado.' });
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error('Erro ao atualizar ativo:', error);
        res.status(500).json({ message: 'Erro ao atualizar ativo', error });
    }
});

// Rota para deletar um produto com base no lote e quantidade (DELETE)
router.delete('/:id_ativo', async (req, res) => {
    const { id_ativo } = req.params; // Pega o id_ativo da URL

    if (!id_ativo) {
        return res.status(400).json({ message: 'id_ativo é necessário.' });
    }

    try {
        const deletedProducts = await Product.deleteMany({
            id_ativo: id_ativo  // Remover todos os produtos com esse id_ativo
        });

        if (deletedProducts.deletedCount === 0) {
            return res.status(404).json({ message: 'Nenhum produto encontrado com esse id_ativo.' });
        }

        res.status(200).json({ message: `${deletedProducts.deletedCount} produto(s) deletado(s) com sucesso` });
    } catch (error) {
        console.error('Erro ao deletar ativo:', error);
        res.status(500).json({ message: 'Erro ao deletar ativo', error });
    }
});


module.exports = router;

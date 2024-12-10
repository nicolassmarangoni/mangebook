<template>
  <div id="app">
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg bg-dark">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">
          <img src="fotos/B.png" alt="Bibliotech" style="height: 30px;" />
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarContent">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <router-link class="nav-link active" to="/ativos">INICIO</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/login">LOGIN</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/gerenciamento">GERENCIAMENTO DE LIVROS</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/minhas-reservas">MINHAS RESERVAS</router-link>
            </li>
          </ul>
          <form class="d-flex" role="search">
            <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
            <button class="btn btn-outline-success" type="submit">Search</button>
          </form>
        </div>
      </div>
    </nav>

    <!-- Header -->
    <div class="container mt-2">
      <h4 class="text-center text-white header-title">LISTA DE LIVROS</h4>
    </div>

    <!-- Livros CRUD -->
    <div class="container mt-4">
      <h2>Gerenciamento de Livros</h2>

      <!-- Adicionar livro -->
      <button class="btn btn-success mb-4" @click="toggleAddForm">Adicionar Livro</button>

      <!-- Formulário para adicionar/editar livro -->
      <div v-if="showAddForm">
        <h3>{{ isEdit ? 'Editar Livro' : 'Adicionar Livro' }}</h3>
        <form @submit.prevent="isEdit ? updateBook() : addBook()" enctype="multipart/form-data">
          <div class="mb-3">
            <label for="title" class="form-label">Título</label>
            <input v-model="currentBook.title" type="text" class="form-control" id="title" required />
          </div>
          <div class="mb-3">
            <label for="author" class="form-label">Autor</label>
            <input v-model="currentBook.author" type="text" class="form-control" id="author" required />
          </div>
          <div class="mb-3">
            <label for="year" class="form-label">Ano de Publicação</label>
            <input v-model="currentBook.year" type="number" class="form-control" id="year" required />
          </div>
          <div class="mb-3">
            <label for="image" class="form-label">Imagem</label>
            <input @change="handleFileChange" type="file" class="form-control" id="image" required />
            <div v-if="currentBook.image">
              <p>Arquivo selecionado: {{ currentBook.image.name }}</p>
              <img v-if="imagePreview" :src="imagePreview" alt="Preview" class="img-fluid" style="max-height: 150px;" />
            </div>
          </div>
          <button type="submit" class="btn btn-primary">{{ isEdit ? 'Atualizar' : 'Adicionar' }}</button>
        </form>
      </div>

      <!-- Listar Livros -->
      <h3 class="mt-4"> </h3>
      <div class="row">
        <div v-for="book in books" :key="book._id" class="col-md-3 mb-4">
          <div class="card">
            <img :src="`http://localhost:3000/${book.image}`" class="img-fluid" :alt="book.title" />
            <div class="card-body">
              <h5 class="card-title">{{ book.title }}</h5>
              <p class="card-text">Autor: {{ book.author }}</p>
              <p class="card-text">Ano: {{ book.year }}</p>
              <button class="btn btn-warning" @click="editBook(book)">Editar</button>
              <button class="btn btn-danger" @click="deleteBook(book._id)">Excluir</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import axios from 'axios';
import { ref, onMounted } from 'vue';

// Definindo variáveis reativas
const books = ref([]);
const currentBook = ref({ title: '', author: '', year: '', image: null });
const imagePreview = ref(null);
const showAddForm = ref(false);
const isEdit = ref(false);

// Funções principais
const toggleAddForm = () => {
  showAddForm.value = !showAddForm.value;
  if (!showAddForm.value) resetForm();
};

const resetForm = () => {
  currentBook.value = { title: '', author: '', year: '', image: null };
  imagePreview.value = null;
  isEdit.value = false;
};

const fetchBooks = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/livros');
    books.value = response.data;
  } catch (error) {
    console.error('Erro ao buscar livros:', error);
  }
};

const addBook = async () => {
  try {
    const formData = new FormData();
    formData.append('title', currentBook.value.title);
    formData.append('author', currentBook.value.author);
    formData.append('year', currentBook.value.year);
    if (currentBook.value.image) {
      formData.append('image', currentBook.value.image);
    }

    await axios.post('http://localhost:3000/api/livros', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    alert('Livro adicionado com sucesso!');
    fetchBooks();
    toggleAddForm();
  } catch (error) {
    console.error('Erro ao adicionar livro:', error);
    alert('Erro ao adicionar o livro.');
  }
};

const editBook = (book) => {
  currentBook.value = { ...book };
  isEdit.value = true;
  showAddForm.value = true;
};

const updateBook = async () => {
  try {
    const formData = new FormData();
    formData.append('title', currentBook.value.title);
    formData.append('author', currentBook.value.author);
    formData.append('year', currentBook.value.year);
    if (currentBook.value.image instanceof File) {
      formData.append('image', currentBook.value.image);
    }

    await axios.put(`http://localhost:3000/api/livros/${currentBook.value._id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    alert('Livro atualizado com sucesso!');
    fetchBooks();
    toggleAddForm();
  } catch (error) {
    console.error('Erro ao atualizar livro:', error);
    alert('Erro ao atualizar o livro.');
  }
};

const deleteBook = async (bookId) => {
  try {
    await axios.delete(`http://localhost:3000/api/livros/${bookId}`);
    alert('Livro excluído com sucesso!');
    fetchBooks();
  } catch (error) {
    console.error('Erro ao excluir livro:', error);
    alert('Erro ao excluir o livro.');
  }
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    currentBook.value.image = file;
    const reader = new FileReader();
    reader.onload = () => {
      imagePreview.value = reader.result;
    };
    reader.readAsDataURL(file);
  }
};

// Carregar livros na inicialização
onMounted(() => {
  fetchBooks();
});
</script>

<style scoped>
body {
  background-color: black;
  color: white;
}

/* Estilos gerais para container */
.container {
  background-color: rgb(0, 0, 0);
  padding: 10px;
  border-radius: 10px;
  margin: 0 auto;
}

/* Títulos, texto da card e outros textos */
h2,
h3,
.card-title,
.card-text {
  color: white;
}

/* Estilo da card */
.card {
  background-color: #333;
  color: white;
}

/* Estilo dos botões dentro da card */
.card-body button {
  margin-right: 5px;
}

/* Alinhamento de texto centralizado */
.text-center {
  text-align: center;
}

/* Estilo específico do container que contém o header */
.container.mt-2 {
  background-color: #333;  /* Cor de fundo */
  padding: 10px;            /* Espaçamento dentro do container */
  border-radius: 8px;       /* Bordas arredondadas */
  margin-top: 20px;         /* Margem superior */
  text-align: center;       /* Centraliza o conteúdo */
  height: 100px;            /* Define uma altura para o container */
  display: flex;            /* Para centralizar o título de forma flexível */
  justify-content: center;  /* Centraliza horizontalmente */
  align-items: center;      /* Centraliza verticalmente */
}

/* Estilo do título dentro do container */
.header-title {
  font-size: 2rem;          /* Tamanho menor do título */
  font-weight: normal;      /* Peso da fonte normal */
  color: white;             /* Cor do texto */
  margin: 0;                /* Remove margem padrão */
  padding: 0;               /* Remove padding extra */
}
</style>

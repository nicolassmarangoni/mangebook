<template>
  <div id="app">
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg bg-dark">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">
          <img src="fotos/B.png" alt="Bibliotech" style="height: 30px;">
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarContent">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <router-link class="nav-link active" to="/">INICIO</router-link>
            </li>
            <li class="nav-item">
              <!-- Modificando o link LOGIN para realizar o logout antes de redirecionar -->
              <router-link 
                class="nav-link" 
                to="/" 
                @click.prevent="logout">
                Logout
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/gerenciar">GERENCIAMENTO DE LIVROS</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/minhas-reservas">MINHAS RESERVAS</router-link>
            </li>
          </ul>
          
          <form class="d-flex" @submit.prevent="searchBooks">
            <input v-model="searchQuery" class="form-control me-2" type="search" placeholder="Buscar por título" aria-label="Search">
            <button class="btn btn-outline-success" type="submit">Buscar</button>
          </form>
        </div>
      </div>
    </nav>

    <!-- Carousel -->
    <div id="carouselExampleSlidesOnly" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-inner">
        <div class="carousel-item active">
          <img :src="carWashImage" class="d-block w-100" alt="Car Wash and Detailing">
        </div>
        <div class="carousel-item">
          <img :src="bannerImage" class="d-block w-100" alt="Banner">
        </div>
      </div>
    </div>

    <!-- Livros -->
    <div class="container custom-container mt-4">

      <div class="row mt-3">
        <div v-if="filteredBooks.length === 0" class="col-12">
          <p class="text-center">Nenhum livro encontrado.</p>
        </div>

        <!-- Cards dos livros -->
        <div v-for="book in filteredBooks" :key="book._id" class="col-md-3 mb-4">
          <div class="card">
            <img :src="`http://localhost:3000/${book.image}`" class="img-fluid" :alt="book.title" />
            <div class="card-body">
              <h5 class="card-title">{{ book.title }}</h5>
              <p class="card-text">Autor: {{ book.author }}</p>
              <p class="card-text">Ano: {{ book.year }}</p>
              <!-- Botão Reservar -->
              <button 
                v-if="!book.reserved" 
                @click="checkReservationAndReserve(book)" 
                class="btn btn-warning"
              >
                Reservar
              </button>
              <!-- Mensagem de livro reservado -->
              <p v-if="book.reserved" class="text-danger">Livro reservado</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="bg-dark text-white text-center py-3 mt-4">
      <p>&copy; 2024 Bibliotech. Todos os direitos reservados.</p>
    </footer>
  </div>
</template>

<script setup>
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import axios from 'axios';
import { ref, onMounted, computed } from 'vue';

// Variáveis reativas para armazenar os livros e a consulta de pesquisa
const books = ref([]);
const searchQuery = ref('');
const userID = ref(null); // Variável reativa para armazenar o userId

// Imagens do carrossel
import carWashImage from '@/assets/images/banner2.jpg';
import bannerImage from '@/assets/images/banner2.jpg';

// Função para buscar os livros da API
const fetchBooks = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/livros');
    books.value = response.data; // Atualizando a variável reativa com os livros recebidos da API
  } catch (error) {
    console.error('Erro ao buscar os livros:', error);
  }
};

// Computed property para filtrar os livros com base no título
const filteredBooks = computed(() => {
  return books.value.filter(book => 
    book.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Recupera o userId do localStorage ao montar o componente
onMounted(() => {
  const storedUserId = localStorage.getItem('userId');
  if (storedUserId) {
    userID.value = storedUserId; // Recupera o userId
    console.log('User ID recuperado:', userID.value);
  }

  // Chama a função de buscar livros ao carregar o componente
  fetchBooks();
});

// Função para verificar se o livro já está reservado
const checkIfReserved = async (bookId) => {
  try {
    const response = await axios.get(`http://localhost:4000/api/reservas/${bookId}`);
    // Se o livro foi encontrado e já está reservado, retornar verdadeiro
    return response.data.reserved;
  } catch (error) {
    console.error('Erro ao verificar reserva:', error);
    return false; // Caso haja erro, assume-se que o livro não está reservado
  }
};

// Função para reservar o livro após a verificação
const checkReservationAndReserve = async (book) => {
  try {
    // Verifica se o userID está definido
    if (!userID.value) {
      alert("Você precisa estar logado para reservar um livro.");
      return;
    }

    // Verifica se o livro já está reservado antes de proceder com a reserva
    const isReserved = await checkIfReserved(book._id);
    if (isReserved) {
      alert("Este livro já foi reservado!");
      return;
    }

    // Enviar a requisição POST para reservar o livro
    await axios.post(
      'http://localhost:4000/api/reservas',
      {
        userId: userID.value,
        bookId: book._id
      }
    );

    // Atualiza a lista de livros após a reserva
    book.reserved = true;

    alert("Livro reservado com sucesso!");
  } catch (error) {
    console.error('Erro ao reservar o livro:', error);
    alert('Erro ao reservar o livro. Tente novamente.');
  }
};

// Função para realizar o logout
const logout = () => {
  // Remover o token e o userId do localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  
  // Redirecionar para a página de login
  window.location.href = '/'; // Redireciona para a página de login
}
</script>

<style scoped>
body {
  background-color: black;
  color: rgb(26, 25, 25);
}

.custom-container {
  background-color: rgb(0, 0, 0);
  padding: 10px;
  border-radius: 10px;
  width: 100%;
  max-width: 1100px;
  height: auto;
  margin: 0 auto;
}

.custom-container h2,
.custom-container p,
.custom-container .nav-link,
.custom-container .img-fluid {
  color: white;
}

.card {
  background-color: #333;
  color: white;
}

.card-body button {
  margin-top: 10px;
}

.text-center {
  text-align: center;
}

.mt-3 {
  margin-top: 1rem;
}

.card-body {
  padding: 1rem;
}

.card-title {
  font-size: 1.2rem;
  font-weight: bold;
}

.card-text {
  font-size: 0.9rem;
}

footer {
  background-color: #333;
  color: white;
}
</style>

<template>
  <div id="app">
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg bg-dark">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">
          <img src="../assets/images/B.png" alt="Bibliotech" style="height: 30px;">
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

    <div class="container mt-2">
      <h4 class="text-center text-white header-title">LISTA DE LIVROS</h4>
    </div>
    <!-- Livros Reservados -->
    <div class="container custom-container mt-4">
      <div class="row mt-3">
        <div v-if="filteredBooks.length === 0" class="col-12">
          <p class="text-center">Nenhum livro reservado encontrado.</p>
        </div>

        <!-- Cards dos livros -->
        <div v-for="book in filteredBooks" :key="book._id" class="col-md-3 mb-4">
          <div class="card">
            <img :src="`http://localhost:3000/${book.image}`" class="card-img-top" :alt="book.title" />
            <div class="card-body">
              <h5 class="card-title">{{ book.title }}</h5>
              <p class="card-text">Autor: {{ book.author }}</p>
              <p class="card-text">Ano: {{ book.year }}</p>
              <p v-if="book.reserved" class="text-danger">Livro reservado</p>
              <button v-if="book.reserved" @click="cancelReservation(book)" class="btn btn-danger cancel-reservation-btn">
                CANCELAR
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
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

const books = ref([]);
const searchQuery = ref('');
const userID = ref(null);

const fetchReservedBooks = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/livros');
    const allBooks = response.data;
    const reservedBooks = await Promise.all(allBooks.map(async (book) => {
      const isReserved = await checkIfReserved(book._id);
      if (isReserved) {
        return { ...book, reserved: true };
      }
      return null;
    }));
    books.value = reservedBooks.filter(book => book !== null);
  } catch (error) {
    console.error('Erro ao buscar os livros reservados:', error);
  }
};

const filteredBooks = computed(() => {
  return books.value.filter(book => 
    book.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

onMounted(() => {
  const storedUserId = localStorage.getItem('userId');
  if (storedUserId) {
    userID.value = storedUserId;
  }
  fetchReservedBooks();
});

const checkIfReserved = async (bookId) => {
  try {
    const response = await axios.get(`http://localhost:4000/api/reservas/${bookId}`);
    return response.data.reserved;
  } catch (error) {
    console.error('Erro ao verificar reserva:', error);
    return false;
  }
};

const cancelReservation = async (book) => {
  try {
    if (!userID.value) {
      alert("Você precisa estar logado para cancelar uma reserva.");
      return;
    }
    const response = await axios.delete('http://localhost:4000/api/reservas/cancelar', {
      data: { bookId: book._id, userId: userID.value }
    });
    const index = books.value.findIndex(b => b._id === book._id);
    if (index !== -1) {
      books.value[index].reserved = false;
    }
    alert(response.data.message);
  } catch (error) {
    console.error('Erro ao cancelar a reserva:', error);
    alert('Erro ao cancelar a reserva. Tente novamente.');
  }
};
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
  max-width: 1100px;
  margin: 0 auto;
}

.card {
  background-color: #333;
  color: white;
}

.card-body button {
  margin-top: 10px;
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

.text-center {
  text-align: center;
}

.mt-3 {
  margin-top: 1rem;
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

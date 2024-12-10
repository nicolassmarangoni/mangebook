<template>
  <div class="container">
    <div class="content first-content">
      <div class="first-column">
        <h2 class="title title-primary">Bem Vindo a Biblioteca Mange!</h2>
        <!-- Usando router-link corretamente -->
        <router-link to="/login">
          <button type="button" class="btn btn-primary">
            Entrar
          </button>
        </router-link>
      </div>
      <div class="second-column">
        <h2 class="title title-second">Criar Conta</h2>
        <form class="form" @submit.prevent="handleRegister">
          <label class="label-input">
            <i class="far fa-user icon-modify"></i>
            <input type="text" v-model="username" placeholder="Nome de Usuário" required>
          </label>

          <label class="label-input">
            <i class="fas fa-lock icon-modify"></i>
            <input type="password" v-model="password" placeholder="Senha" required>
          </label>

          <button class="btn btn-second">Cadastrar</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'; // Importa Axios

// Criando uma instância do Axios com baseURL
const api = axios.create({
  baseURL: 'http://localhost:4000/api/auth', // Substitua pela URL correta do seu backend
});

export default {
  name: 'HomePage',  // Ajuste o nome do componente se necessário
  data() {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
    // Método para redirecionar para a página de login
    goToLogin() {
      this.$router.push({ name: 'login' });
    },

    // Método para manipular o cadastro
   // Método para manipular o cadastro
async handleRegister() {
  // Verifica se os campos estão preenchidos
  if (!this.username || !this.password) {
    this.errorMessage = "Por favor, preencha todos os campos!";
    return;
  }

  try {
    // Realizando a requisição POST para criar o usuário
    await api.post('/register', {
      username: this.username,
      password: this.password
    });

    // Sucesso no registro
    this.successMessage = "Cadastro realizado com sucesso!";
    this.errorMessage = ''; // Limpa a mensagem de erro

    // Redireciona para a página de login após o sucesso
    this.$router.push('/login');
  } catch (error) {
    // Se ocorrer um erro na requisição
    this.errorMessage = error.response?.data?.message || "Ocorreu um erro durante o cadastro.";
    this.successMessage = ''; // Limpa a mensagem de sucesso
  }
}
  }
};
</script>

<style src="../assets/css/styles2.css"></style>

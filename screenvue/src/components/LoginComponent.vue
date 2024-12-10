<template>
  <div class="container">
    <div class="content first-content">
      <!-- Coluna da mensagem de boas-vindas -->
      <div class="first-column">
        <h2 class="title title-primary">Bem Vindo a Biblioteca Mange!</h2>
      </div>

      <!-- Coluna do formulário de login -->
      <div class="second-column">
        <h2 class="title title-second">Login</h2>

        <!-- Formulário de login -->
        <form class="form" @submit.prevent="login"> <!-- Use o submit para chamar o login -->
          <label class="label-input">
            <i class="far fa-user icon-modify"></i>
            <input
              v-model="username"
              type="text"
              placeholder="Nome de Usuário"
              required
            />
          </label>

          <label class="label-input">
            <i class="fas fa-lock icon-modify"></i>
            <input
              v-model="password"
              type="password"
              placeholder="Senha"
              required
            />
          </label>

          <!-- Botão de login -->
          <button type="submit" class="btn btn-second">Entrar</button>
        </form>

        <!-- Mensagem de erro caso ocorra -->
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

        <!-- Botão para navegação à página de registro -->
        <router-link to="/registro">
          <button type="button" class="btn btn-primary">Criar Conta</button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'; // Importa Axios

const api = axios.create({
  baseURL: 'http://localhost:4000/api/auth', // Substitua pela URL correta do seu backend
});

export default {
  data() {
    return {
      username: '',
      password: '',
      errorMessage: '',
    };
  },
  methods: {
    // Método de login assíncrono
    async login() {
      try {
        const response = await api.post('/login', {
          username: this.username,
          password: this.password,
        });
        console.log('User  ID armazenado:', response.data.userId);

        localStorage.setItem('authToken', response.data.token);   // Armazena o token JWT
        localStorage.setItem('userId', response.data.userId);     // Armazena o userId

        // Verifica se a mensagem de sucesso está na resposta
        if (response.data.message === "Login realizado") {
          localStorage.setItem('token', response.data.token); // Armazena o token se houver
          this.$router.push('/ativos'); // Redireciona para a página desejada
        } else {
          this.errorMessage = 'Login falhou. Verifique suas credenciais.';
        }
      } catch (error) {
        this.errorMessage = 'Erro no login. Tente novamente.';
        console.error('Erro no login:', error.response ? error.response.data : error.message);
      }
    },
  },
};
</script>


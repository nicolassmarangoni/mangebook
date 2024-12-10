import api from 'axios'; // Certifique-se de que o axios esteja instalado e importado corretamente

export default {
    data() {
        return {
            username: '',
            password: '',
            errorMessage: '',
        };
    },
    methods: {
        async login() {
            try {
                const response = await api.post('http://localhost:5000/api/auth/login', { // Ajuste a URL conforme necessário
                    username: this.username,
                    password: this.password,
                });

                // Verifica se a resposta contém sucesso e token
                if (response.data && response.data.success) {
                    localStorage.setItem('token', response.data.token); // Salvar o token no localStorage
                    this.$router.push('/ativos'); // Redireciona para a página "ativos" (ajuste a rota se necessário)
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

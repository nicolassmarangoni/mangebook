import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '../components/LoginComponent.vue'; // Caminho para o componente de login
import Ativos from '../components/AtivosComponent.vue'; // Caminho para o componente de ativos
import Register from '../components/RegisterComponent.vue'; 
import Gerenciar from '../components/GerenciarComponent.vue'
import MinhasReservas from '@/components/MinhasReservas.vue';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'Login',
        component: Login, // Define a página de login como rota principal
    },
    {
        path: '/registro',
        name: 'Register',
        component: Register, 
    },
    {
        path: '/ativos',
        name: 'Ativos',
        component: Ativos,
        meta: { requiresAuth: true }, // Rota protegida
    },
    {
        path: '/gerenciar',
        name: 'Gerenciar',
        component: Gerenciar,
        meta: { requiresAuth: true },
    },
     {
        path: '/minhas-reservas',
        name: 'MinhasReservas',
        component: MinhasReservas,
        meta: { requiresAuth: true }, // Rota protegida
    },
    {
        path: '*',
        redirect: '/', // Redireciona para login qualquer rota não definida
    },
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
});

// Middleware de verificação de autenticação
router.beforeEach((to, from, next) => {
    const loggedIn = localStorage.getItem('token'); // Verifica se há um token de autenticação no localStorage
    if (to.matched.some(record => record.meta.requiresAuth) && !loggedIn) {
        next('/'); // Redireciona para a página de login se não estiver autenticado
    } else {
        next(); // Permite o acesso à rota solicitada
    }
});

export default router;

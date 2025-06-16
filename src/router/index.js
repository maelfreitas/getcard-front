import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import SignUp from '../views/SignUp.vue'; // Tela de cadastro
import Profile from '../views/Profile.vue'; // Importar a tela de Profile

const routes = [
    { path: '/', component: Home },  // Página inicial
    { path: '/login', component: Login },  // Página de login
    { path: '/signup', component: SignUp },  // Página de cadastro
    { path: '/profile', component: Profile },  // Rota para a tela de Profile
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;

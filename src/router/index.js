import { createRouter, createWebHistory } from "vue-router";
import RegisterPage from "@/views/RegisterPage.vue";
import LoginPage from "@/views/LoginPage.vue";


const routes = [
    { path: "/", component: LoginPage},
    { path: "/login", component: LoginPage},
    { path: "/register", component: RegisterPage},
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;

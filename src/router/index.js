import { createRouter, createWebHistory } from "vue-router";
import RegisterPage from "@/views/RegisterPage.vue";
import LoginPage from "@/views/LoginPage.vue";
import VisitProfilePage from "@/views/VisitProfilePage.vue";
import Dashboard from "@/views/Dashboard.vue";


const routes = [
    { path: "/", component: LoginPage},
    { path: "/login", component: LoginPage},
    { path: "/register", component: RegisterPage},
    { path: "/visit/:cardCode", component: VisitProfilePage},
    { path: "/dashboard", component: Dashboard}
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
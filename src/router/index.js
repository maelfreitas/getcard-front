import { createRouter, createWebHistory } from "vue-router";
import RegisterPage from "@/views/RegisterPage.vue";
import LoginPage from "@/views/LoginPage.vue";
import VisitProfilePage from "@/views/VisitProfilePage.vue";
import Dashboard from "@/views/Dashboard.vue";
import EditProfilePage from "@/views/EditProfilePage.vue";
import CheckCard from "@/views/CheckCard.vue";
import ExperiencesPage from "@/views/ExperiencesPage.vue";
import ProductsPage from "@/views/ProductsPage.vue";
import AddProductPage from "@/views/AddProductPage.vue";
import ServicesPage from "@/views/ServicesPage.vue";
import AddServicePage from "@/views/AddServicePage.vue";



const routes = [
    { path: "/", component: LoginPage},
    { path: "/login", component: LoginPage},
    { path: "/register", component: RegisterPage},
    { path: "/visit/:cardCode", component: VisitProfilePage},
    { path: "/dashboard", component: Dashboard, meta: {requiresAuth: true}},
    { path: "/profile/edit", component: EditProfilePage, meta: {requiresAuth: true}},
    { path: "/check/:cardCode", component: CheckCard},
    { path: "/profile/:profileId/experiences", component: ExperiencesPage, meta: {requiresAuth: true}},
    { path: "/profile/:profileId/products", component: ProductsPage, meta: {requiresAuth: true}},
    { path: "/products/new", component: AddProductPage, meta: {requiresAuth: true}},
    { path: "/products/edit/:id", component: AddProductPage, meta: {requiresAuth: true}},
    { path: "/profile/:profileId/services", component: ServicesPage, meta: {requiresAuth: true}},
    { path: "/services/new", component: AddServicePage, meta: {requiresAuth: true}},
    { path: "/services/edit/:id", component: AddServicePage, meta: {requiresAuth: true}},
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')
    if (to.meta.requiresAuth && !token) {
        next('/login')
    } else {
        next()
    }
});

export default router;
import axios from "axios";
import router from "@/router";

const api = axios.create({
    baseURL: "http://localhost:8080/api", // Certifique-se de que essa URL está correta
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor para adicionar o token no cabeçalho
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token"); // Recupera o token do localStorage
        if (token) {
            console.log("Incluindo token no cabeçalho:", token);
            config.headers.Authorization = `Bearer ${token}`; // Adiciona o token no cabeçalho Authorization
        } else {
            console.warn("Nenhum token encontrado no localStorage");
        }
        return config;
    },
    (error) => {
        console.error("Erro no interceptor de requisição:", error);
        return Promise.reject(error); // Propaga erros
    }
);

// Interceptor para lidar com respostas (ex.: tratamento de 401)
api.interceptors.response.use(
    (response) => response, // Resposta bem-sucedida
    (error) => {
        if (error.response?.status === 401) {
            console.error("Autenticação falhou, redirecionando para login...");
            alert("Sua sessão expirou. Faça login novamente.");

            // Remove o token inválido
            localStorage.removeItem("token");

            // Redireciona para a página de login
            router.push("/login");
        }
        return Promise.reject(error); // Propaga o erro
    }
);

export default api;
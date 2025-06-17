<script setup>
import { ref, onMounted } from "vue";
import api from "@/services/api";
import { useRouter } from "vue-router";

const userName = ref("");
const router = useRouter();

onMounted(async () => {
  try {
    const response = await api.get("/profile/me", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    userName.value = response.data.fullName || "Usuário";
  } catch (error) {
    console.error("Erro ao carregar perfil", error);
    router.push("/login");  // Se token inválido, volta pro login
  }
});

const goToEditProfile = () => {
  router.push("/profile/edit");
};

const goToPublicPage = () => {
  router.push(`/visit/${localStorage.getItem("userId")}`);  // Exemplo de rota pública
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  router.push("/login");
};
</script>

<template>
  <div class="dashboard">
    <h1>Bem-vindo, {{ userName }}!</h1>

    <button @click="goToEditProfile">Editar meu perfil</button>
    <button @click="goToPublicPage">Ver minha página pública</button>
    <button @click="logout">Sair</button>
  </div>
</template>

<style scoped>
.dashboard {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}
button {
  margin: 10px;
  padding: 10px 20px;
  cursor: pointer;
}
</style>

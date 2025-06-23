<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "@/services/api";

const router = useRouter();
const user = ref(null);
const cardCode = ref("");
const profileId = ref(null);
const errorMessage = ref("");

const loadUserData = async () => {
  try {
    const response = await api.get("/user/me");
    user.value = response.data;
    cardCode.value = response.data.cardCode;
  } catch (error) {
    console.error("Erro ao carregar dados do usuário:", error);
    errorMessage.value = "Erro ao carregar seus dados.";
  }
};

// Buscar o Profile ID do usuário logado
const fetchProfileId = async () => {
  try {
    const response = await api.get("/profile/me");
    profileId.value = response.data.id;
  } catch (error) {
    errorMessage.value = "Erro ao carregar perfil.";
  }
};

const goToExperiences = () => {
  if (profileId.value) {
    router.push(`/profile/${profileId.value}/experiences`);
  } else {
    errorMessage.value = "Profile não encontrado!";
  }
};

const logout = () => {
  localStorage.removeItem("token");
  router.push("/login");
};

onMounted(() => {
  loadUserData();
  fetchProfileId();
});
</script>

<template>
  <div class="dashboard-container">
    <h1>Bem-vindo, {{ user?.username}}</h1>

    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>

    <div v-if="user">
      <p><strong>Email:</strong> {{ user.email }}</p>

      <router-link to="/profile/edit">Editar Perfil</router-link>

      <div v-if="cardCode">
        <p><strong>Seu Link Público:</strong></p>
        <router-link :to="`/visit/${cardCode}`">
          Ver minha página pública
        </router-link>
      </div>

      <div>
        <button @click="goToExperiences">Editar Minhas Experiências</button>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </div>

      <button @click="logout">Sair</button>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  max-width: 600px;
  margin: 30px auto;
  padding: 20px;
  background-color: #eaf4ff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

h1 {
  color: #2c3e50;
}

a {
  display: block;
  margin: 10px 0;
  color: #007bff;
}

button {
  background-color: #dc3545;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

button:hover {
  background-color: #c82333;
}

.error {
  color: red;
  margin-top: 10px;
}
</style>

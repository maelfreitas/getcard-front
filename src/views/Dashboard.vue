<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "@/services/api";

const router = useRouter();
const user = ref(null);
const cardCode = ref("");
const profileId = ref(null);
const errorMessage = ref("");
const profile = ref(null);

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

const fetchProfile = async () => {
  try {
    const response = await api.get("/profile/me");
    profile.value = response.data;
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
  fetchProfile();
});
</script>

<template>
  <div class="dashboard-wrapper">
    <div class="dashboard-card">
      <!-- Foto de Perfil -->
      <div class="profile-photo-wrapper">
        <img
            v-if="profile?.profileImageUrl"
            :src="profile.profileImageUrl"
            alt="Foto de perfil"
            class="profile-photo"
        />
        <div v-else class="profile-photo placeholder"></div>
      </div>

      <h1>Bem-vindo, {{ user?.username }}</h1>

      <div v-if="errorMessage" class="error">{{ errorMessage }}</div>

      <div v-if="user">

        <router-link class="link-button" to="/profile/edit">Editar Perfil</router-link>

        <div v-if="cardCode" class="public-link-section">
          <router-link class="link-button" :to="`/visit/${cardCode}`">
            Ver minha página pública
          </router-link>
        </div>

        <div class="action-buttons">
          <button class="secondary" @click="goToExperiences">Editar Minhas Experiências</button>
          <button class="danger" @click="logout">Sair</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-wrapper {
  min-height: 100vh;
  background: linear-gradient(to bottom right, #f0f8ff, #d6eaff);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 2rem;
}

.dashboard-card {
  background-color: white;
  border-radius: 16px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.profile-photo-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.profile-photo,
.profile-photo.placeholder {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: fill;
  image-rendering: auto;
  border: 4px solid #3498db;
  background-color: white;
}

.profile-photo.placeholder {
  background-color: #ffffff;
  border: 2px dashed #ccc;
}

h1 {
  margin: 0.5rem 0 1rem;
  font-size: 1.8rem;
  color: #2c3e50;
}

p {
  margin: 0.3rem 0;
  color: #333;
}

.link-button {
  display: inline-block;
  margin: 1rem 0;
  color: #fff;
  background-color: #3498db;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
}

.link-button:hover {
  background-color: #2980b9;
}

.public-link-section {
  margin: 1rem 0;
}

.public-link {
  display: inline-block;
  margin-top: 0.3rem;
  color: #007bff;
  text-decoration: underline;
  font-weight: 500;
}

.action-buttons {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

button {
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
}

button.secondary {
  background-color: #28a745;
  color: white;
}

button.secondary:hover {
  background-color: #218838;
}

button.danger {
  background-color: #dc3545;
  color: white;
}

button.danger:hover {
  background-color: #c82333;
}

.error {
  color: red;
  font-weight: bold;
  margin-top: 1rem;
}
</style>

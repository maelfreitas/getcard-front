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
  background-color: #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0;
  color: white;
  font-family: Arial, sans-serif;
}

.dashboard-card {
  background-color: #1a1a1a;

  height: 100vh;
  width: 100vw;
  max-width: 500px;
  text-align: center;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.profile-photo-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.profile-photo,
.profile-photo.placeholder {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  image-rendering: auto;
  background-color: #1a1a1a;
  border: 3px solid #00ff99;
  margin-top: 1rem;
}

.profile-photo.placeholder {
  border: 2px dashed #666;
  background-color: #2a2a2a;
}

h1 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: white;
}

p {
  margin: 0.3rem 0;
  color: #ccc;
}

.link-button {
  display: inline-block;
  color: #1a1a1a;
  background-color: #00ff99;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.3s;
}

.link-button:hover {
  background-color: #00cc7a;
  color: white;
}

.public-link-section {
  margin: 1rem 0;
}


.action-buttons {
  display: flex;
  flex-direction: column;
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
  display: inline-block;
  margin-bottom: 1rem;
  color: #1a1a1a;
  background-color: #00ff99;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.3s;
}

button.secondary:hover {
  background-color: #00cc7a;
  color: white;
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

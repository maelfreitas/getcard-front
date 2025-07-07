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

const goToProducts = () => {
  if (profileId.value) {
    router.push(`/profile/${profileId.value}/products`);
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
  <div class="container">
    <div class="card">
      <!-- Cabeçalho -->
      <div class="header">
        <h1>{{ user?.username }}</h1>
      </div>

      <!-- Foto de Perfil -->
      <div class="profile-image">
        <img
            v-if="profile?.profileImageUrl"
            :src="profile.profileImageUrl"
            alt="Foto de perfil"
        />
        <img
            v-else
            src="https://cdn-icons-png.flaticon.com/512/1995/1995574.png"
            alt="Placeholder"
        />
      </div>

      <!-- Mensagem de erro -->
      <div v-if="errorMessage" class="error">{{ errorMessage }}</div>

      <!-- Botões -->
      <div v-if="user" class="button-group">
        <router-link class="btn blue" to="/profile/edit">Editar perfil</router-link>
        <router-link class="btn blue" @click=goToProducts to="">Produtos</router-link>
        <router-link class="btn blue" to="#">Serviços</router-link>
        <router-link class="btn blue" to="#">Localização</router-link>

        <router-link
            v-if="cardCode"
            class="btn green"
            :to="`/visit/${cardCode}`"
        >
          Visualizar meu perfil
        </router-link>

        <button class="btn red" @click="logout">Sair</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
.container {
  font-family: 'Poppins', sans-serif;
  min-height: 100vh;
  width: 100%;
  background-color: #1e1e1e;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card {
  height: 100vh;
  width: 100%;
  background-color: #d3d3d3;
  overflow: hidden;
  text-align: center;
}

.header {
  background-color: #2897CA;
  padding: 276px 10px 30px;
}

.header h1 {
  color: white;
  font-size: 32px;
  margin-top: -200px;

  font-weight: bold;
}

.profile-image {
  margin-top: -104px;
}

.profile-image img {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: 6px solid black;
  background-color: white;
  object-fit: cover;
}

.button-group {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 25px;
  padding: 20px 60px;
}

.btn {
  padding: 10px;
  border-radius: 10px;
  width: 100%;
  border: 1px solid black;
  font-weight: bold;
  color: white;
  text-decoration: none;
  text-align: center;
  cursor: pointer;
}

.btn.blue {
  background-color: #2897CA;
}

.btn.green {
  background-color: #30B27F;
}

.btn.red {
  display: flex;
  width: 40%;
  margin-top: 30px;
  border-radius: 20px;
  justify-content: center;
  align-items: center;
  border: none;
  background-color: #C70000;
}

.btn:hover {
  opacity: 0.9;
}

.error {
  color: red;
  font-weight: bold;
  margin-top: 10px;
}
</style>

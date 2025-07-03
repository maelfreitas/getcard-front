<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'

const route = useRoute()


const cardCode = route.params.cardCode || ''
const defaultCover = 'https://dados.uema.br/wp-content/uploads/2023/12/Brasao_horizontal_UEMA_PB.jpg'

const profile = ref(null)
const errorMessage = ref('')
const loading = ref(true)

const goToLink = (url) => {
  if (url && !url.startsWith('http')) {
    url = 'https://' + url
  }
  window.open(url, '_blank')
}

onMounted(async () => {
  if (!cardCode) {
    errorMessage.value = 'Código do cartão não informado.'
    loading.value = false
    return
  }
  try {
    const res = await api.get(`/profile/public/${cardCode}`)
    profile.value = res.data

  } catch (e) {
    errorMessage.value = 'Perfil não encontrado para este cartão.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div :class="['public-profile', profile?.theme || 'light']">
    <div v-if="loading" class="loading">Carregando...</div>

    <div v-else-if="errorMessage" class="error">{{ errorMessage }}</div>


    <div v-else-if="profile" class="card">
      <div class="cover-shape">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" class="cover-svg">
          <polygon points="0,0 100,0 100,60 50,100 0,60"  />
        </svg>

        <div class="name-title">
          <h2>{{ profile.name.toUpperCase() }}</h2>
          <p>{{ profile.profession }}</p>
        </div>
      </div>
      <div class="profile-image">
        <img
            v-if="profile.profileImageUrl"
            :src="profile.profileImageUrl"
            alt="Foto do perfil"
        />
      </div>

      <div class="description-box">
        <p>
          {{ profile.bio }}
        </p>
      </div>

      <div class="actions">
        <button
            v-if="profile.phone"
            @click="goToLink(`https://wa.me/${profile.phone.replace(/\D/g, '')}`)"
            class="icon-button"
        >
          <i class="fab fa-whatsapp"></i>
        </button>

        <button v-if="profile.instagram" @click="goToLink(profile.instagram)" class="icon-button">
          <i class="fab fa-instagram"></i>
        </button>

        <button v-if="profile.linkedin" @click="goToLink(profile.linkedin)" class="icon-button">
          <i class="fab fa-linkedin"></i>
        </button>

        <button v-if="profile.email" @click="goToLink(`mailto:${profile.email}`)" class="icon-button">
          <i class="fa-regular fa-envelope"></i>
        </button>
      </div>

      <!-- Descrição -->

      <hr class="divider" />


    </div>
    <!-- Rodapé -->
  </div>
</template>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

.public-profile, .card, .footer, body {
  font-family: "Poppins", sans-serif;
}

.public-profile {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  box-sizing: border-box;
  background-color: var(--bg);
  color: var(--text);
}

.card {
  width: 100%;
  max-width: 600px;
  min-height: 100vh;
  padding: 30px;
  text-align: center;
  margin: auto;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  background-color: var(--card);
  box-sizing: border-box;
}

.cover-shape {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 350px;
  z-index: 1;
}

.cover-svg {
  width: 100%;
  height: 100%;
  display: block;
}

.cover-svg polygon{
  fill: #2898CA;
}

.name-title {
  position: absolute;
  top: 70px;
  left: 0;
  width: 100%;
  text-align: center;
  color: white;
  z-index: 2;
}

.name-title h2 {
  margin: 0;
  font-size: 2.2rem;
  font-weight: 800;
  color: #fff;
}

.name-title p {
  margin: 0;
  font-size: 20px;
}

.profile-image {
  position: absolute;
  top: 180px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
}

.profile-image img {
  width: 200px;
  height: 200px;
  border: 4px solid black;
  border-radius: 50%;
  object-fit: cover;
  background-color: white;
}

.description-box {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin: 330px 0 15px;
  background: var(--accent);
  padding: 35px 14px 10px 14px;
  border-radius: 15px;
  color: #fff;
  font-size: 1rem;
  box-shadow: 0 1px 4px rgba(0,0,0,0.03);
  text-align: left;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin: 30px 0 15px;
}

.icon-button {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: none;
  color: var(--accent);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 35px;
  transition: color 0.2s;
  border: none;
  cursor: pointer;
}


.divider {
  margin: 1rem 0;
  border: none;
}

.experiences {
  padding: 0 2rem;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.experience-card {
  background: var(--experience-bg);
  border-left: 4px solid var(--accent);
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  color: var(--text);
}

.experience-card p {
  margin: 0.25rem 0;
  line-height: 1.4;
}

.loading {
  color: var(--text);
}

.error {
  color: red;
  font-weight: bold;
  text-align: center;
  margin: 1rem;
}

.experiences h3 {
  margin-top: 0;
  font-size: 1.6rem;
  margin-bottom: 8px;
  font-weight: 700;
  color: #fff;
  text-align: center;
  position: relative;
  display: inline-block;
  left: 50%;
  transform: translateX(-50%);
}

.experiences h3::after {
  content: '';
  display: block;
  margin: 8px auto 0 auto;
  width: 40px;
  height: 4px;
  border-radius: 2px;
  background: var(--accent);
}

.public-profile.light {
  --bg: #D3D3D3;
  --text: #1a1a1a;
  --text-light: #555;
  --card: #D3D3D3;
  --accent: #2898CA;
  --accent-hover: #2898CA;
  --border: #ddd;
  --experience-bg: #e5e4e4;
}

.public-profile.dark {
  --bg: #1B1F26;
  --text: #f1f1f1;
  --text-light: #bbb;
  --card: #1B1F26;
  --accent: #2898CA;
  --accent-hover: #2898CA;
  --border: #333;
  --experience-bg: #242b34;
}

.footer {
  width: 100%;
  padding: 16px 0 8px 0;
  text-align: center;
  font-size: 0.95rem;
  color: var(--text-light);
}


</style>


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
          <h2>{{ profile.name }}</h2>
          <p>Empresário</p>
        </div>
      </div>
      <div class="profile-image">
        <img
            v-if="profile.profileImageUrl"
            :src="profile.profileImageUrl"
            alt="Foto do perfil"
        />
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
      <div class="description-box">
        <h3>Descrição</h3>
        <p>
          {{ profile.bio }}
        </p>
      </div>
      <hr class="divider" />

      <div v-if="profile.experiences?.length" class="experiences">
        <h3>Experiências</h3>
        <div class="experience-card" v-for="exp in profile.experiences" :key="exp.id">
          <p><strong>{{ exp.title }}</strong></p>
          <p>{{ exp.workplace }} - {{ exp.location }}</p>
          <p>{{ exp.startYear }} - {{ exp.endYear }}</p>
        </div>
      </div>
    </div>
    <!-- Rodapé -->
    <footer class="footer">
      <span>Projeto UEMA Card &copy; 2025</span>
    </footer>
  </div>
</template>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');

.public-profile, .card, .footer, body {
  font-family: 'Inter', sans-serif;
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
  height: 300px;
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

.cover-container {
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  image-rendering: optimizeQuality;
  display: block;
}

.profile-image {
  position: absolute;
  top: 180px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
}

.profile-image img {
  width: 160px;
  height: 160px;
  border: 1px solid black;
  border-radius: 50%;
  object-fit: cover;
  background-color: white;
}

.description-box {
  background: var(--accent);
  margin: 0 24px;
  margin-top: 12px;
  padding: 16px 14px 10px 14px;
  border-radius: 12px;
  color: #fff;
  font-size: 1rem;
  box-shadow: 0 1px 4px rgba(0,0,0,0.03);
  text-align: left;
}

.description-box h3 {
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

.description-box h3::after {
  content: '';
  display: block;
  margin: 8px auto 0 auto;
  width: 40px;
  height: 4px;
  border-radius: 2px;
  background: var(--accent);
}

.profile-photo {
  position: relative;
  top: -70px;
  margin-bottom: -65px;
  z-index: 1;
  width: 140px;
  height: 140px;
  object-fit: fill;
  border-radius: 50%;
  border: 4px solid var(--accent);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin: 360px 0 15px;
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

.icon-button:hover {
  background: none;
  color: var(--secondary);
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

@media (max-width: 600px) {
  .card {
    min-height: unset;
    padding-bottom: 80px;
  }
  .experiences {
    padding: 0 0.5rem;
  }
  .description-box {
    margin: 0 6px;
  }
}
</style>


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
      <div class="cover-container">
        <img
            class="cover-image"
            :src="profile.coverImageUrl || defaultCover"
            alt="Capa do perfil"
        />
      </div>
      <img
          v-if="profile.profileImageUrl"
          :src="profile.profileImageUrl"
          alt="Foto do perfil"
          class="profile-photo"
      />

      <h2>{{ profile.name }}</h2>
      <p class="bio">{{ profile.bio }}</p>

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
          <i class="fa fa-envelope"></i>
        </button>
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
  </div>
</template>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

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

h2 {
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.bio {
  font-size: 1rem;
  color: var(--text-light);
  margin-bottom: 1.5rem;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.icon-button {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: var(--accent);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  transition: background 0.3s;
  border: none;
  cursor: pointer;
}

.icon-button:hover {
  background-color: var(--accent-hover);
}

.divider {
  margin: 1rem 0;
  border: none;
  border-top: 1px solid var(--border);
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

.public-profile.light {
  --bg: #f9f9f9;
  --text: #1a1a1a;
  --text-light: #555;
  --card: #ffffff;
  --accent: #0077ff;
  --accent-hover: #0059c1;
  --border: #ddd;
  --experience-bg: #f1f1f1;
}

.public-profile.dark {
  --bg: #1B1F26;
  --text: #f1f1f1;
  --text-light: #bbb;
  --card: #1B1F26;
  --accent: #00b4ff;
  --accent-hover: #0099cc;
  --border: #333;
  --experience-bg: #242b34;
}
</style>


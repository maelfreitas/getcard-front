<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()

const cardCode = route.params.cardCode || ''

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
  <div class="public-profile">
    <div v-if="loading" class="loading">Carregando...</div>

    <div v-else-if="errorMessage" class="error">{{ errorMessage }}</div>

    <div v-else-if="profile" class="card">
      <img v-if="profile.profileImageUrl" :src="profile.profileImageUrl" alt="Foto do perfil" class="profile-photo" />

      <h2>{{ profile.name }}</h2>
      <p class="bio">{{ profile.bio }}</p>

      <div class="actions">
        <button v-if="profile.phone" @click="goToLink(`https://wa.me/${profile.phone.replace(/\D/g, '')}`)">
          WhatsApp
        </button>

        <button v-if="profile.instagram" @click="goToLink(profile.instagram)">
          Instagram
        </button>

        <button v-if="profile.linkedin" @click="goToLink(profile.linkedin)">
          LinkedIn
        </button>

        <button v-if="profile.email" @click="goToLink(`mailto:${profile.email}`)">
          E-mail
        </button>
      </div>

      <div v-if="profile.experiences && profile.experiences.length > 0" class="experiences">
        <h3>Experiências</h3>
        <div class="experience-card" v-for="exp in profile.experiences" :key="exp.id">
          <p><strong>{{ exp.title }}</strong></p>
          <p>{{ exp.workplace }}</p>
          <p>{{ exp.location }}</p>
          <p>{{ exp.startYear }} - {{ exp.endYear }}</p>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.public-profile {
  min-height: 100vh;
  min-width: 412px;
  width: 100%;
  max-width: 500px;
  justify-content: center;
  align-items: center;
  color: white;
  font-family: Arial, sans-serif;
}

.card {
  background: #1a1a1a;
  padding: 2rem;
  border-radius: 16px;
  height: 100vh;
  text-align: center;
  box-shadow: 0 8px 16px rgba(0,0,0,0.3);
}

.profile-photo {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
  border: 3px solid #00ff99;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.bio {
  font-size: 1rem;
  color: #ccc;
  margin-bottom: 1.5rem;
  word-wrap: break-word;
}

.actions button {
  display: block;
  width: 100%;
  background: #00ff99;
  color: black;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  margin-bottom: 0.75rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
  word-wrap: break-word;
}

.actions button:hover {
  background: #00cc7a;
}

.experiences {
  text-align: left;
  margin-top: 1.5rem;
}

.experiences ul {
  padding: 0;
  list-style: none;
}

.experiences li {
  margin-bottom: 0.75rem;
}

.experiences {
  text-align: left;
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.experience-card {
  background: #2a2a2a;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  color: white;
}

.experience-card p {
  margin: 0.25rem 0;
  line-height: 1.4;
}


.loading {
  color: white;
}

.error {
  color: red;
  font-weight: bold;
  text-align: center;
  margin: 1rem;
}

@media (max-width: 480px) {
  .card {
    max-width: 90%;
  }

  .profile-photo {
    width: 100px;
    height: 100px;
  }

  h2 {
    font-size: 1.2rem;
  }

  .bio, .actions button {
    font-size: 0.9rem;
  }
}
</style>

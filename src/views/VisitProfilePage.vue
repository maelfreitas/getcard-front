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

onMounted(async () => {
  if (!cardCode) {
    errorMessage.value = 'Código do cartão não informado.'
    loading.value = false
    return
  }
  try {
    const res = await api.get(`/profile/public/${cardCode}`)
    profile.value = res.data

    // Se socialLinks for string JSON, parse para objeto para mostrar bonitinho
    if (profile.value.socialLinks) {
      try {
        profile.value.socialLinks = JSON.parse(profile.value.socialLinks)
      } catch {
        // deixa como string se falhar
      }
    }
  } catch (e) {
    errorMessage.value = 'Perfil não encontrado para este cartão.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="public-profile">
    <button @click="router.back()">Voltar</button>

    <div v-if="loading">Carregando...</div>

    <div v-else>
      <div v-if="errorMessage" class="error">{{ errorMessage }}</div>

      <div v-else-if="profile">
        <h1>{{ profile.name }}</h1>
        <img v-if="profile.profileImageUrl" :src="profile.profileImageUrl" alt="Foto do perfil" class="profile-photo" />
        <p><strong>Telefone:</strong> {{ profile.phone }}</p>
        <p><strong>Bio:</strong> {{ profile.bio }}</p>

        <div v-if="profile.socialLinks && typeof profile.socialLinks === 'object'">
          <h3>Redes Sociais</h3>
          <ul>
            <li v-for="(link, key) in profile.socialLinks" :key="key">
              <a :href="link" target="_blank" rel="noopener noreferrer">{{ key }}</a>
            </li>
          </ul>
        </div>
      </div>

      <div v-else>
        <p>Perfil não disponível.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.public-profile {
  max-width: 600px;
  margin: auto;
  padding: 1rem;
  font-family: Arial, sans-serif;
}

.profile-photo {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 1rem;
}

.error {
  color: red;
  font-weight: bold;
  margin: 1rem 0;
}
</style>

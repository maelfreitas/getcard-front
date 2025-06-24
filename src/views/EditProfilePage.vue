<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'  // sua instância axios configurada
import { useRouter } from 'vue-router'

const router = useRouter()

const profile = ref({
  name: '',
  phone: '',
  bio: '',
  profileImageUrl: '',
  instagram: '',
  linkedin: '',
})

const errorMessage = ref('')
const successMessage = ref('')

// Buscar perfil ao montar componente
onMounted(async () => {
  try {
    const res = await api.get('/profile/me')
    profile.value = {
      ...res.data,
      socialLinks: JSON.stringify(JSON.parse(res.data.socialLinks || '{}'), null, 2), // formatar JSON bonito
    }
  } catch (e) {
    errorMessage.value = 'Erro ao carregar perfil.'
  }
})

const saveProfile = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  try {
    // Converter socialLinks de volta para string compacta
    const payload = {
      ...profile.value,
      socialLinks: JSON.stringify(JSON.parse(profile.value.socialLinks)),
    }
    await api.put('/profile/me', payload)
    successMessage.value = 'Perfil salvo com sucesso!'
  } catch (e) {
    errorMessage.value = e.response?.data?.message || 'Erro ao salvar perfil.'
  }
}
</script>

<template>
  <div class="profile-edit">
    <h2>Editar Perfil</h2>

    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    <div v-if="successMessage" class="success">{{ successMessage }}</div>

    <form @submit.prevent="saveProfile">

      <label for="name">Nome:</label>
      <input id="name" v-model="profile.name" type="text" placeholder="Nome completo"/>

      <label for="phone">Telefone:</label>
      <input id="phone" v-model="profile.phone" type="text" placeholder="Telefone"/>

      <label for="bio">Bio:</label>
      <textarea id="bio" v-model="profile.bio" rows="4" placeholder="Fale sobre você"></textarea>

      <label for="profileImageUrl">URL da Imagem do Perfil:</label>
      <input id="profileImageUrl" v-model="profile.profileImageUrl" type="url" placeholder="https://..."/>

      <label for="instagram">URL do instagram:</label>
      <input id="instagram" v-model="profile.instagram" type="text" placeholder="https://..."/>

      <label for="linkedIn">URL do linkedIn:</label>
      <input id="linkedIn" v-model="profile.linkedin" type="text" placeholder="https://..."/>

      <button type="submit">Salvar</button>
    </form>
  </div>
</template>

<style scoped>
.profile-edit {
  max-width: 500px;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

input, textarea {
  width: 100%;
  padding: 0.5rem;
  box-sizing: border-box;
}

.error {
  color: red;
}

.success {
  color: green;
}

button {
  padding: 0.75rem 1.5rem;
  cursor: pointer;
}
</style>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import { useRouter } from 'vue-router'

const router = useRouter()

const profile = ref({
  name: '',
  phone: '',
  email: '',
  bio: '',
  profileImageUrl: '',
  instagram: '',
  linkedin: '',
})

const errorMessage = ref('')
const successMessage = ref('')
const isUploading = ref(false)
const selectedFileName = ref('')

// Buscar perfil ao montar componente
onMounted(async () => {
  try {
    const res = await api.get('/profile/me')
    profile.value = res.data
    console.log('URL da imagem carregada:', profile.value.profileImageUrl)
  } catch (e) {
    errorMessage.value = 'Erro ao carregar perfil.'
  }
})

const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  selectedFileName.value = file.name
  isUploading.value = true
  const formData = new FormData()
  formData.append("file", file)

  try {
    const response = await api.post('/upload/profile-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    profile.value.profileImageUrl = response.data.url
    successMessage.value = 'Imagem de perfil atualizada com sucesso!'
    setTimeout(() => successMessage.value = '', 3000)
  } catch (e) {
    errorMessage.value = 'Erro ao fazer upload da imagem.'
  } finally {
    isUploading.value = false
  }
}

const saveProfile = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (!profile.value.name || !profile.value.phone || !profile.value.bio) {
    errorMessage.value = 'Preencha todos os campos obrigatórios.'
    return
  }

  try {
    await api.put('/profile/me', profile.value)
    successMessage.value = 'Perfil salvo com sucesso!'
    setTimeout(() => successMessage.value = '', 3000)
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
      <input id="name" v-model="profile.name" type="text" placeholder="Nome completo" />

      <label for="phone">Telefone:</label>
      <input id="phone" v-model="profile.phone" type="text" placeholder="Telefone" />

      <label for="phone">Email:</label>
      <input id="email" v-model="profile.email" type="text" placeholder="Email" />

      <label for="bio">Bio:</label>
      <textarea id="bio" v-model="profile.bio" rows="4" placeholder="Fale sobre você"></textarea>

      <label for="profileImage">Selecionar nova imagem:</label>
      <input id="profileImage" type="file" @change="handleFileUpload" />
      <p v-if="selectedFileName">Arquivo selecionado: {{ selectedFileName }}</p>
      <p v-if="isUploading">Enviando imagem...</p>
      <img v-if="profile.profileImageUrl" :src="profile.profileImageUrl" alt="Foto de perfil" width="200" />

      <label for="instagram">URL do Instagram:</label>
      <input id="instagram" v-model="profile.instagram" type="text" placeholder="https://..." />

      <label for="linkedin">URL do LinkedIn:</label>
      <input id="linkedin" v-model="profile.linkedin" type="text" placeholder="https://..." />

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
  padding-bottom: 2rem;
}

input,
textarea {
  width: 100%;
  padding: 0.5rem;
  box-sizing: border-box;
}

.error {
  color: red;
  background-color: #ffe5e5;
  padding: 0.5rem;
  border-radius: 5px;
}

.success {
  color: green;
  background-color: #e5ffe5;
  padding: 0.5rem;
  border-radius: 5px;
}

button {
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  border: none;
  background-color: #3498db;
  color: white;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #2980b9;
}

img {
  border-radius: 10px;
  border: 2px solid #ccc;
  margin-top: 10px;
  max-width: 100%;
}
</style>

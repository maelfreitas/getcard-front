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
  theme: '',
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
    router.push("/dashboard");
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
    <img v-if="profile.profileImageUrl" :src="profile.profileImageUrl" alt="Foto de perfil" width="200" />
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
      <p v-if="isUploading">Enviando imagem...</p>


      <label for="instagram">URL do Instagram:</label>
      <input id="instagram" v-model="profile.instagram" type="text" placeholder="https://..." />

      <label for="linkedin">URL do LinkedIn:</label>
      <input id="linkedin" v-model="profile.linkedin" type="text" placeholder="https://..." />

      <label for="theme">Tema:</label>
      <select id="theme" v-model="profile.theme">
        <option value="light">Claro</option>
        <option value="dark">Escuro</option>
      </select>


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
  padding: 2rem;
  background-color: #1a1a1a;
  color: white;
  border-radius: 16px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.3);
  font-family: Arial, sans-serif;
}

h2 {
  color: #00ff99;
  text-align: center;
}

label {
  font-weight: bold;
  margin-top: 0.5rem;
  color: #00ff99;
}

input,
textarea {
  width: 100%;
  padding: 0.75rem;
  background-color: #2a2a2a;
  border: 1px solid #444;
  color: white;
  border-radius: 8px;
  box-sizing: border-box;
  font-size: 1rem;
  transition: border-color 0.3s;
}

input:focus,
textarea:focus {
  border-color: #00ff99;
  outline: none;
}

button {
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  border: none;
  background-color: #00ff99;
  color: #1a1a1a;
  border-radius: 8px;
  font-weight: bold;
  font-size: 1rem;
  transition: background-color 0.3s ease;
  margin-top: 1rem;
}

button:hover {
  background-color: #00cc7a;
  color: white;
}

img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 3px solid #00ff99;
  margin-top: 1rem;
  image-rendering: auto;
  display: block;
  margin-left: auto;
  margin-right: auto;
}


.error {
  color: red;
  background-color: #330000;
  padding: 0.75rem;
  border-radius: 8px;
  font-weight: bold;
}

.success {
  color: #00ff99;
  background-color: #003322;
  padding: 0.75rem;
  border-radius: 8px;
  font-weight: bold;
}

p {
  color: #ccc;
  font-size: 0.9rem;
}

</style>

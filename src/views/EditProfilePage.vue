<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import { useRouter } from 'vue-router'
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'

const router = useRouter()

const profile = ref({
  name: '',
  phone: '',
  email: '',
  bio: '',
  profileImageUrl: '',
  instagram: '',
  linkedin: '',
  location: '',
  theme: '',
})

const errorMessage = ref('')
const successMessage = ref('')
const isUploading = ref(false)
const cropImageModal = ref(false)
const imageToCrop = ref(null)
const cropperRef = ref(null)

onMounted(async () => {
  try {
    const res = await api.get('/profile/me')
    profile.value = res.data
  } catch (e) {
    errorMessage.value = 'Erro ao carregar perfil.'
  }
})

const onFileChange = (event) => {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = () => {
    imageToCrop.value = reader.result
    cropImageModal.value = true
  }
  reader.readAsDataURL(file)
}

const uploadCroppedImage = async () => {
  const canvas = cropperRef.value.getResult().canvas

  if (!canvas) {
    errorMessage.value = 'Erro ao recortar a imagem.'
    return
  }

  isUploading.value = true
  canvas.toBlob(async (blob) => {
    const formData = new FormData()
    formData.append('file', blob, 'cropped-profile.jpg')

    try {
      const response = await api.post('/upload/profile-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      profile.value.profileImageUrl = response.data.url
      successMessage.value = 'Imagem de perfil atualizada com sucesso!'
    } catch (e) {
      errorMessage.value = 'Erro ao fazer upload da imagem.'
    } finally {
      isUploading.value = false
      cropImageModal.value = false
    }
  }, 'image/jpeg')
}

const saveProfile = async () => {
  if (!profile.value.name || !profile.value.phone || !profile.value.bio) {
    errorMessage.value = 'Preencha todos os campos obrigatórios.'
    return
  }

  try {
    await api.put('/profile/me', profile.value)
    successMessage.value = 'Perfil salvo com sucesso!'
    setTimeout(() => successMessage.value = '', 3000)
    router.push('/dashboard')
  } catch (e) {
    errorMessage.value = e.response?.data?.message || 'Erro ao salvar perfil.'
  }
}
</script>

<template>
  <div class="container">
    <div class="header">
      <h1>Editar Perfil</h1>
    </div>

    <div class="form-card">
      <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
      <div v-if="successMessage" class="success">{{ successMessage }}</div>

      <img v-if="profile.profileImageUrl" :src="profile.profileImageUrl" alt="Foto de perfil" class="avatar" />

      <form @submit.prevent="saveProfile">
        <label for="name">Nome</label>
        <input id="name" v-model="profile.name" type="text" />

        <label for="bio">Descrição</label>
        <textarea id="bio" v-model="profile.bio" rows="3" />

        <label for="profileImageUrl">Foto de perfil</label>
        <div class="custom-file-input-wrapper">
          <input
              type="text"
              v-model="profile.profileImageUrl"
              placeholder="URL da imagem ou nome do arquivo"
              readonly
          />

          <input
              type="file"
              accept="image/*"
              @change="onFileChange"
              class="input-file-hidden"
              ref="fileInput"
          />

          <!-- Botão visual "+" -->
          <button type="button" class="upload-icon" @click="$refs.fileInput.click()">+</button>
        </div>


        <p v-if="isUploading">Enviando imagem...</p>

        <label for="phone">Telefone</label>
        <input id="phone" v-model="profile.phone" type="text" />

        <label for="instagram">Instagram</label>
        <input id="instagram" v-model="profile.instagram" type="text" />

        <label for="linkedin">Linkedin</label>
        <input id="linkedin" v-model="profile.linkedin" type="text" />

        <label for="email">Email</label>
        <input id="email" v-model="profile.email" type="email" />

        <div class="buttons">
          <button type="button" class="btn cancel" @click="router.push('/dashboard')">Cancelar</button>
          <button type="submit" class="btn save">Salvar</button>
        </div>
      </form>
    </div>

    <!-- Modal de Corte de Imagem -->
    <div v-if="cropImageModal" class="modal">
      <div class="modal-content">
        <h3>Recorte sua imagem</h3>
        <Cropper
            class="cropper"
            :src="imageToCrop"
            :stencil-props="{ aspectRatio: 1 }"
            ref="cropperRef"
        />
        <button @click="uploadCroppedImage">Usar imagem recortada</button>
        <button @click="cropImageModal = false">Cancelar</button>
      </div>
    </div>
  </div>
</template>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
.container {
  min-height: 100vh;
  background-color: #D3D3D3;
  display: flex;
  color: rgba(0, 0, 0, 0.5);
  flex-direction: column;
  align-items: center;
  font-family: 'Poppins', sans-serif;
}

.header {
  width: 100%;
  background-color: #2897ca;
  padding: 450px 10px 30px;
  text-align: center;
}

.header h1 {
  color: white;
  font-size: 24px;
  margin-top: -400px;
  font-weight: bold;
}

.form-card {
  background-color: white;
  border-radius: 16px;
  max-width: 600px;
  width: 90%;
  margin-top: -380px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.3);
  z-index: 2;
}

form {
  display: flex;
  padding: 25px;
  flex-direction: column;
  gap: 5px;
}

label {
  font-weight: 600;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.5);
}

input,
textarea {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border: 2px solid #2897ca;
  border-radius: 10px;
  box-sizing: border-box;
  outline: none;
}

textarea {
  resize: none;
}

.custom-file-input-wrapper {
  position: relative;
  width: 100%;
}

.custom-file-input-wrapper input[type="text"] {
  width: 100%;
  padding: 10px 40px 10px 12px; /* espaço pro botão à direita */
  font-size: 14px;
  border: 2px solid #2897ca;
  border-radius: 10px;
  box-sizing: border-box;
  background-color: white;
  color: #333;
}

.input-file-hidden {
  display: none;
}

.upload-icon {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  line-height: 24px;
  border-radius: 50%;
  background-color: #2897ca;
  color: white;
  font-weight: bold;
  border: none;
  font-size: 18px;
  cursor: pointer;
}


.upload-wrapper input[type="file"] {
  width: 100%;
  padding-right: 2rem;
}



.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid #000;
  margin: 0 auto 0 auto;
  display: block;
  object-fit: cover;
}

.buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.btn {
  padding: 10px;
  width: 48%;
  border-radius: 20px;
  font-weight: bold;
  font-size: 14px;
  border: none;
  cursor: pointer;
}

.btn.cancel {
  background-color: #c70000;
  color: white;
}

.btn.save {
  background-color: #2897ca;
  color: white;
}

.btn:hover {
  opacity: 0.9;
}

.error {
  color: red;
  background-color: #ffe6e6;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  text-align: center;
}

.success {
  color: green;
  background-color: #e6fff2;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  text-align: center;
}

.modal {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99;
}

.modal-content {
  background: #1a1a1a;
  padding: 2rem;
  border-radius: 10px;
  max-width: 90%;
  max-height: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.cropper {
  width: 300px;
  height: 300px;
  background-color: #333;
  border: 1px solid #00ff99;
}
</style>


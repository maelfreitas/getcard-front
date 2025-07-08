<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import { useRoute, useRouter } from 'vue-router'
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'

const route = useRoute()
const router = useRouter()
const productId = ref(route.params.id || null) // <- Aqui verifica se está editando
const profileId = ref(null)

const product = ref({
  name: '',
  description: '',
  img: '',
  link: '',
})

const errorMessage = ref('')
const successMessage = ref('')
const isUploading = ref(false)
const cropImageModal = ref(false)
const imageToCrop = ref(null)
const cropperRef = ref(null)

const fetchProfile = async () => {
  try {
    const response = await api.get("/profile/me");
    profileId.value = response.data.id;
  } catch (error) {
    errorMessage.value = "Erro ao carregar perfil.";
  }
}

// 🆕 Carrega dados se for edição
const fetchProduct = async () => {
  if (!productId.value) return
  try {
    const response = await api.get(`/product/${productId.value}`)
    product.value = response.data
  } catch (error) {
    errorMessage.value = 'Erro ao carregar produto.'
  }
}

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
      product.value.img = response.data.url
    } catch (e) {
      errorMessage.value = 'Erro ao fazer upload da imagem.'
    } finally {
      isUploading.value = false
      cropImageModal.value = false
    }
  }, 'image/jpeg')
}

const addProduct = async () => {
  try {
    await api.post(`/product/add/${profileId.value}`, product.value)
    product.value = { name: "", description: "", img: "", link: "" }
    successMessage.value = 'Produto adicionado com sucesso!'
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "Erro ao adicionar produto!"
  }
}

// 🆕 Atualizar produto
const updateProduct = async () => {
  try {
    await api.put(`/product/update/${productId.value}`, product.value)
    successMessage.value = 'Produto atualizado com sucesso!'
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "Erro ao atualizar produto!"
  }
}

onMounted(() => {
  fetchProfile()
  fetchProduct()
})
</script>


<template>
  <div class="container">
    <div class="header">
      <h1>{{ productId ? 'Atualizar Produto' : 'Cadastrar Produto' }}</h1>
    </div>

    <div class="form-card">
      <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
      <div v-if="successMessage" class="success">{{ successMessage }}</div>



      <form @submit.prevent="productId ? updateProduct() : addProduct()">
        <label v-if="productId" for="name">Nome</label>
        <input id="name" v-model="product.name" type="text" placeholder="Nome do produto" />

        <label v-if="productId" for="description">Descrição</label>
        <textarea id="description" v-model="product.description" rows="3" placeholder="Descrição"/>
        <div class="custom-file-input-wrapper">
          <!-- Imagem dentro do campo -->
          <label v-if="productId" for="img">Imagem do produto</label>
          <img v-if="product.img" :src="product.img" class="input-preview-img" />

          <!-- Campo de texto apenas visual -->
          <input
              type="text"
              v-model="product.img"
              placeholder="Adicionar imagem"
              readonly
              class="input-with-img"
          />

          <input
              type="file"
              accept="image/*"
              @change="onFileChange"
              class="input-file-hidden"
              ref="fileInput"
          />

          <button type="button" class="upload-icon" @click="$refs.fileInput.click()">+</button>
        </div>

        <label v-if="productId" for="link">Link do produto</label>
        <input id="link" v-model="product.link" type="text" placeholder="Link do produto" />

        <div class="buttons">
          <button type="submit" class="btn save">
            {{ productId ? 'Salvar' : 'Adicionar Produto' }}
          </button>
          <button type="button" class="btn cancel" @click="router.back()">{{ productId ? 'Cancelar' : 'Voltar' }}</button>
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
        <p v-if="isUploading">Enviando imagem...</p>
        <button @click="uploadCroppedImage">Usar imagem</button>
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
  padding: 450px 0 30px;
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
  margin-top: -360px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.3);
  z-index: 2;
}

form {
  display: flex;
  padding: 40px;
  margin-top: 50px;
  flex-direction: column;
}

label {
  font-weight: 600;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.5);
}

input{
  margin-bottom: 50px;
}
input,
textarea {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  font-family: inherit;
  border: 2px solid #2897ca;
  border-radius: 10px;
  box-sizing: border-box;
  outline: none;
  margin-bottom: 20px;
}



.custom-file-input-wrapper {
  position: relative;
  width: 100%;
}

.input-with-img {
  padding-left: 50px; /* espaço para imagem à esquerda */
  padding-right: 40px; /* espaço para botão à direita */
  height: 40px;
}

.input-preview-img {
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #ccc;
  background-color: white;
  z-index: 1;
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


.buttons {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 50px;
}

.btn {
  padding: 10px;
  width: 100%;
  height: 40px;
  border-radius: 35px;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
}

.btn.cancel {
  background-color: white;
  color: #2897ca;
  border: #2897ca solid 1px;
}

.btn.save {
  background-color: #2897ca;
  color: white;
  border: none;
  box-shadow: 0 6px 6px rgba(0,0,0,0.3);
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


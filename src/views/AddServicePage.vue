<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import { useRoute, useRouter } from 'vue-router'
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'

const route = useRoute()
const router = useRouter()
const profileId = ref(null);
const serviceId = ref(route.params.id || null)

const service = ref({
  title: '',
  description: '',
})

const errorMessage = ref('')
const successMessage = ref('')

const fetchProfile = async () => {
  try {
    const response = await api.get("/profile/me");
    profileId.value = response.data.id;
  } catch (error) {
    errorMessage.value = "Erro ao carregar perfil.";
  }
};

const fetchService = async () => {
  if (!serviceId.value) return
  try {
    const response = await api.get(`/service/${serviceId.value}`)
    service.value = response.data
  } catch (error) {
    errorMessage.value = 'Erro ao carregar serviço.'
  }
}

const addService = async () => {
  try {
    await api.post(`/service/add/${profileId.value}`, service.value);
    service.value = { title: "", description: ""};
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "Erro ao adicionar experiência!";
  }
};

const updateService = async () => {
  try {
    await api.put(`/service/update/${serviceId.value}`, service.value)
    successMessage.value = 'Serviço atualizado com sucesso!'
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "Erro ao atualizar serviço!"
  }
};

onMounted(() => {
  fetchProfile();
  fetchService()
});
</script>

<template>
  <div class="container">
    <div class="header">
      <h1>{{ serviceId ? 'Atualizar Serviço' : 'Adicionar Serviço' }}</h1>
    </div>

    <div class="form-card">
      <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
      <div v-if="successMessage" class="success">{{ successMessage }}</div>

      <form @submit.prevent="serviceId ? updateService() : addService()">
        <input id="title" v-model="service.title" type="text" placeholder="Nome do serviço" />
        <textarea id="description" v-model="service.description" rows="8" placeholder="Descrição"/>

        <div class="buttons">
          <button type="submit" class="btn save"> {{ serviceId ? 'Salvar' : 'Adicionar Serviço' }}</button>
          <button type="button" class="btn cancel" @click="router.back()">Voltar</button>
        </div>
      </form>
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
  font-size: 32px;
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
  padding: 47px;
  margin-top: 50px;
  flex-direction: column;
  gap: 50px;
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
  font-family: inherit;
  border: 2px solid #2897ca;
  border-radius: 10px;
  box-sizing: border-box;
  outline: none;
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
  margin-bottom: 60px;
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

</style>


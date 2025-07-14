<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()
const services = ref([])
const loading = ref(true)
const profileId = route.params.profileId;

onMounted(async () => {
  try {
    const response = await api.get(`/service/list/${profileId}`);
    services.value = response.data
  } catch (err) {
    console.error('Erro ao carregar serviços:', err)
  } finally {
    loading.value = false
  }
})

const goToAdd = () => router.push('/services/new')
const goBack = () => router.back()
const editProduct = (id) => router.push(`/services/edit/${id}`)
</script>

<template>
  <div class="container">
    <div class="header">
      <h1>Editar serviços</h1>
    </div>

    <div class="form-card">
      <!-- Lista de produtos -->
      <div v-if="!loading && services.length > 0" class="product-list">
        <div
            v-for="service in services"
            :key="service.id"
            class="product-card"
            @click="editProduct(service.id)"
        >
          <div class="product-info">
            <h3>{{ service.title }}</h3>
            <p>{{ service.description.slice(0, 80) }}...</p>
          </div>
          <span class="arrow">›</span>
        </div>
      </div>

      <!-- Lista vazia -->
      <div v-else-if="!loading" class="empty">
        <img src="../assets/empty-icon.png" width="80"  alt=""/>
        <p>Lista vazia!</p>
      </div>

      <div class="footer-buttons">
        <button class="back" @click="goBack">Voltar</button>
        <button class="add" @click="goToAdd">Adicionar</button>
      </div>
    </div>


  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

/* MODIFICADO: Adicionado display: flex e flex-direction */
.container {
  width: 100%;
  max-width: 600px;
  min-height: 100vh;
  box-sizing: border-box;
  overflow: hidden;
  text-align: center;
  font-family: 'Poppins', sans-serif;
  display: flex;
  flex-direction: column;
}

.header {
  width: 100%;
  background-color: #2897ca;
  padding: 169px 10px 30px;
  text-align: center;
}

.header h1 {
  color: white;
  font-size: 24px;
  margin-top: -130px;
  font-weight: bold;
}

/* MODIFICADO: Removido min-height e adicionado flex: 1 */
.form-card {
  background: #D3D3D3;
  border-radius: 45px 45px 0 0;
  max-width: 600px;
  width: 100%;
  margin-top: -100px;
  z-index: 2;
  border-bottom: none;
  display: flex;
  flex-direction: column;
  padding: 40px 20px 0;
  box-sizing: border-box;
  flex: 1;
}

.product-list, .empty {
  flex-grow: 1;
}

.product-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.product-card {
  display: flex;
  align-items: center;
  background: white;
  height: 100px;
  border-radius: 35px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  padding: 12px;
  cursor: pointer;
  transition: transform 0.2s;
}

.product-card:hover {
  transform: scale(1.01);
}


.product-info {
  text-align: start;
  flex: 1;
  font-family: inherit;
  margin-left: 12px;
}

.product-info h3 {
  margin: 0;
  color: black;
  font-size: 16px;
  font-weight: bold;
}

.product-info p {
  margin: 4px 0 0;
  font-size: 14px;
  font-weight: normal;
  font-family: inherit;
  color: black;
}

.arrow {
  font-size: 41px;
  color: black;

}

.empty {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  color: black;
  font-weight: bold;
  font-size: 16px;
}

.footer-buttons {
  padding: 22px 30px;
  display: flex;
  justify-content: space-between;
}

.footer-buttons button {
  padding: 10px 20px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 14px;
  border: none;
  cursor: pointer;
  min-width: 100px;
}

.footer-buttons .back {
  background: white;
  border: 2px solid #2897ca;
  color: #2897ca;
}

.footer-buttons .add {
  background-color: #2897ca;
  color: white;
}
</style>

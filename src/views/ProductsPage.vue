<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/services/api'

const route = useRoute()
const products = ref([])
const loading = ref(true)
const profileId = route.params.profileId;

onMounted(async () => {
  try {
    const response = await api.get(`/product/list/${profileId}`);
    products.value = response.data
  } catch (err) {
    console.error('Erro ao carregar produtos:', err)
  } finally {
    loading.value = false
  }
})

const goToAdd = () => route.push('/products/new')
const goBack = () => route.push('/dashboard')
const editProduct = (id) => route.push(`/products/${id}/edit`)
</script>

<template>
  <div class="container">
    <div class="header">
      <h1>Editar produtos</h1>
    </div>

    <div class="form-card">
      <!-- Lista de produtos -->
      <div v-if="!loading && products.length > 0" class="product-list">
        <div
            v-for="product in products"
            :key="product.id"
            class="product-card"
            @click="editProduct(product.id)"
        >
          <img :src="product.img" alt="Produto" class="product-image" />
          <div class="product-info">
            <h3>{{ product.name }}</h3>
            <p>{{ product.description.slice(0, 80) }}...</p>
          </div>
          <span class="arrow">›</span>
        </div>
      </div>

      <!-- Lista vazia -->
      <div v-else-if="!loading" class="empty">
        <img src="https://cdn-icons-png.flaticon.com/512/2748/2748558.png" width="80" />
        <p>Lista vazia!</p>
      </div>
    </div>

    <div class="footer-buttons">
      <button class="back" @click="goBack">Voltar</button>
      <button class="add" @click="goToAdd">Adicionar</button>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
.container {
  width: 100%;
  max-width: 600px;
  min-height: 100vh;
  flex: 1;
  box-sizing: border-box;
  overflow: hidden;
  text-align: center;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  font-family: 'Poppins', sans-serif;
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

.form-card {
  background: #D3D3D3;
  border-radius: 45px 45px 0 0 ;
  max-width: 600px;
  height: 80vh;
  width: 100%;
  margin-top: -100px;
  z-index: 2;
}

.product-list {
  display: flex;
  padding: 40px 20px;
  flex-direction: column;
  gap: 20px;
}

.product-card {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  padding: 12px;
  cursor: pointer;
  transition: transform 0.2s;
}

.product-card:hover {
  transform: scale(1.01);
}

.product-image {
  width: 64px;
  height: 64px;
  object-fit: contain;
  border-radius: 12px;
  background: #f0f0f0;
}

.product-info {
  flex: 1;
  margin-left: 12px;
}

.product-info h3 {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
}

.product-info p {
  margin: 4px 0 0;
  font-size: 13px;
  color: #555;
}

.arrow {
  font-size: 24px;
  color: black;
  font-weight: bold;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 100px;
  color: black;
  font-weight: bold;
  font-size: 16px;
}

.footer-buttons {
  background-color: #d3d3d3;
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

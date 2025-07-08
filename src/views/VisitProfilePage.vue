<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'

const route = useRoute()


const cardCode = route.params.cardCode || ''
const activeTab = ref('inicio')
const profile = ref(null)
const errorMessage = ref('')
const loading = ref(true)
const products = ref([])
const produtoAtual = ref(0)


const goToLink = (url) => {
  if (url && !url.startsWith('http')) {
    url = 'https://' + url
  }
  window.open(url, '_blank')
}

const proximoProduto = () => {
  produtoAtual.value = (produtoAtual.value + 1) % products.value.length
}

const produtoAnterior = () => {
  produtoAtual.value =
      (produtoAtual.value - 1 + products.value.length) % products.value.length
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

    if (profile.value?.id) {
      try {
        const productRes = await api.get(`/product/list/${profile.value.id}`)
        products.value = productRes.data
      } catch (err) {
        console.error('Erro ao carregar produtos:', err)
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
  <div class="container" :class="[profile?.theme || 'light']">
    <!-- Conteúdo dinâmico -->
    <div class="content">
      <div v-if="activeTab === 'inicio'">
        <div class="public-profile">
          <div v-if="loading" class="loading">Carregando...</div>

          <div v-else-if="errorMessage" class="error">{{ errorMessage }}</div>


          <div v-else-if="profile" class="card">
            <div class="cover-shape">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" class="cover-svg">
                <polygon points="0,0 100,0 100,60 50,100 0,60"  />
              </svg>

              <div class="name-title">
                <h2>{{ profile.name.toUpperCase() }}</h2>
                <p>{{ profile.profession }}</p>
              </div>
            </div>
            <div class="profile-image">
              <img
                  v-if="profile.profileImageUrl"
                  :src="profile.profileImageUrl"
                  alt="Foto do perfil"
              />
            </div>

            <div class="description-box">
              <p>
                {{ profile.bio }}
              </p>
            </div>

            <div class="actions">
              <button
                  v-if="profile.phone"
                  @click="goToLink(`https://wa.me/${profile.phone.replace(/\D/g, '')}`)"
                  class="icon-button"
              >
                <i class="ti ti-brand-whatsapp"></i>
              </button>

              <button v-if="profile.instagram" @click="goToLink(profile.instagram)" class="icon-button">
                <i class="ti ti-brand-instagram"></i>
              </button>

              <button v-if="profile.linkedin" @click="goToLink(profile.linkedin)" class="icon-button">
                <i class="ti ti-brand-linkedin"></i>
              </button>

              <button v-if="profile.email" @click="goToLink(`mailto:${profile.email}`)" class="icon-button">
                <i class="ti ti-mail"></i>
              </button>
            </div>
          </div>

        </div>
      </div>

      <div v-else-if="activeTab === 'produtos'" class="produtos">
        <div class="public-profile">
          <div class="card-header">
            <h1>Produtos</h1>
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
        </div>
      </div>


      <div v-else-if="activeTab === 'servicos'">
        <h1>Serviços</h1>
        <p>Conteúdo genérico de serviços será exibido aqui.</p>
      </div>
    </div>

    <!-- Barra de navegação inferior -->
    <nav class="bottom-nav">
      <button
          :class="{ active: activeTab === 'inicio' }"
          @click="activeTab = 'inicio'"
      >
        <i class="fa-solid fa-house"></i>
        <span>Início</span>
      </button>
      <button
          :class="{ active: activeTab === 'produtos' }"
          @click="activeTab = 'produtos'"
      >
        <i class="fa-solid fa-cart-shopping"></i>
        <span>Produtos</span>
      </button>
      <button
          :class="{ active: activeTab === 'servicos' }"
          @click="activeTab = 'servicos'"
      >
        <i class="fa-solid fa-hand-holding-hand"></i>
        <span>Serviços</span>
      </button>
    </nav>
  </div>

</template>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
@import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css');

.public-profile, .card, body, .bottom-nav {
  font-family: "Poppins", sans-serif;
}

.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.content {
  flex: 1;
  overflow: hidden;
  flex-direction: column;
  align-items: center;
}

.public-profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  background-color: var(--bg);
  color: var(--text);
}

.card {
  width: 100%;
  max-width: 600px;
  min-height: 100vh;
  flex: 1;
  padding: 30px 20px 140px;
  box-sizing: border-box;
  overflow: hidden;
  text-align: center;
  background-color: var(--card);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.cover-shape {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 350px;
  z-index: 1;
}

.cover-svg {
  width: 100%;
  height: 100%;
  display: block;
}

.cover-svg polygon{
  fill: #2898CA;
}

.name-title {
  position: absolute;
  top: 70px;
  left: 0;
  width: 100%;
  text-align: center;
  color: white;
  z-index: 2;
}

.name-title h2 {
  margin: 0;
  font-size: 2.2rem;
  font-weight: 800;
  color: #fff;
}

.name-title p {
  margin: 0;
  font-size: 20px;
}

.profile-image {
  position: absolute;
  top: 210px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
}

.profile-image img {
  width: 200px;
  height: 200px;
  border: 6px solid black;
  border-radius: 50%;
  object-fit: cover;
  background-color: white;
}

.description-box {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin: 360px 8px 15px;
  background: var(--accent);
  padding: 40px 14px 10px 14px;
  border-radius: 20px;
  color: #fff;
  font-size: 1rem;
  box-shadow: 0 5px 4px rgba(0, 0, 0, 0.21);
  text-align: left;
}

.actions {
  position: fixed;
  bottom: 80px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 16px;
  z-index: 10;
  background: transparent;
  padding: 0;
}

.icon-button {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: none;
  color: var(--accent);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 35px;
  transition: color 0.2s;
  border: none;
  cursor: pointer;
}

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 600px;
  height: 60px;
  background-color: var(--accent);
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
  z-index: 9;
}

.bottom-nav button {
  position: relative;
  flex: 1;
  height: 100%;
  background-color: transparent;
  border: none;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
}

.bottom-nav button i {
  font-size: 22px;
  margin-bottom: 2px;
}

.bottom-nav button span {
  font-size: 12px;
  font-family: "Poppins", sans-serif;
}

.bottom-nav button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.bottom-nav button.active {
  background-color: var(--accent);
}

.bottom-nav button.active::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 50%;
  height: 3px;
  background-color: white;
  border-radius: 0 0 3px 3px;
}

.loading {
  color: var(--text);
}

.error {
  color: red;
  font-weight: bold;
  text-align: center;
  margin: 1rem;
}


.card-header {
  width: 100%;
  background-color: #2897ca;
  padding: 169px 10px 30px;
  text-align: center;
}

.card-header h1 {
  color: white;
  font-size: 24px;
  margin-top: -130px;
  font-weight: bold;
}
.form-card {
  width: 100%;
  max-width: 600px;
  min-height: 100vh;
  flex: 1;
  padding: 30px 20px 140px;
  box-sizing: border-box;
  overflow: hidden;
  text-align: center;
  margin-top: -100px;
  border-radius: 25px;
  background-color: var(--card);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  z-index: 3;
}

.product-list, .empty {
  flex-grow: 1; /* Continua empurrando os botões para baixo DENTRO do card */
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
  justify-content: center;
  align-items: center;
  width: 100%;
  color: black;
  font-weight: bold;
  font-size: 16px;
}


.container.light {
  --bg: #D3D3D3;
  --text: #1a1a1a;
  --text-light: #555;
  --card: #D3D3D3;
  --accent: #2897CA;
  --accent-hover: #2897CA;
  --border: #ddd;
}

.container.dark {
  --bg: #1B1F26;
  --text: #f1f1f1;
  --text-light: #bbb;
  --card: #1B1F26;
  --accent: #2897CA;
  --accent-hover: #2897CA;
  --border: #333;
  --experience-bg: #242b34;
}


@media (max-width: 400px) {
  .cover-shape {
    height: 300px;
  }
  .name-title h2 {
    font-size: 1.8rem;
  }

  .name-title p {
    font-size: 0.9rem;
  }

  .profile-image {
    top: 180px;
  }

  .profile-image img {
    width: 170px;
    height: 170px;
  }

  .description-box {
    font-size: 0.9rem;
    margin-top: 300px;
  }

  .icon-button {
    font-size: 28px;
    width: 44px;
    height: 44px;
  }

  .actions {
    gap: 10px;
    padding: 6px 14px;
  }
}


</style>


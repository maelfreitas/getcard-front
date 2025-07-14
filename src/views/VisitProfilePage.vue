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
const services = ref([])
const produtoAtual = ref(0)
const servicoAtual = ref(0)


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

const proximoServico = () => {
  servicoAtual.value = (servicoAtual.value + 1) % services.value.length
}

const servicoAnterior = () => {
  servicoAtual.value =
      (servicoAtual.value - 1 + services.value.length) % services.value.length
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

        const serviceRes = await api.get(`/service/list/${profile.value.id}`)
        services.value = serviceRes.data
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

            <!-- Carrossel -->
            <div v-if="!loading && products.length > 0" class="carousel-container">
              <button class="carousel-arrow left" @click="produtoAnterior">&#10094;</button>
              <Transition name="slide-fade" mode="out-in">
                <div class="carousel-card" :key="produtoAtual">
                  <img :src="products[produtoAtual].img" alt="Produto" class="product-image" />
                  <h3>{{ products[produtoAtual]?.name }}</h3>
                  <p>{{ products[produtoAtual]?.description }}</p>
                  <div class="link-div">
                    <button class="link-button" @click="goToLink(products[produtoAtual].link)">
                      Acessar link <i class="fa-solid fa-up-right-from-square"></i>
                    </button>
                  </div>
                </div>
              </Transition>

              <button class="carousel-arrow right" @click="proximoProduto">&#10095;</button>
            </div>

            <!-- Indicadores -->
            <div v-if="!loading && products.length > 0" class="carousel-dots">
    <span
        v-for="(p, index) in products"
        :key="index"
        :class="{ dot: true, active: index === produtoAtual }"
    ></span>
            </div>

            <!-- Lista vazia -->
            <div v-if="!loading && products.length < 1" class="empty">
              <img src="../assets/empty-icon.png" width="80" />
              <p>Lista vazia!</p>
            </div>


          </div>
        </div>
      </div>

      <div v-else-if="activeTab === 'servicos'" class="servicos-page">
        <div class="public-profile">
        <!-- Cabeçalho Azul com Título -->
        <div class="card-header">
          <h1>Serviços</h1>
        </div>
        <div class="form-card">


        <!-- Carrossel -->
        <div v-if="services.length >0" class="carousel-container">
          <button class="carousel-arrow left" @click="servicoAnterior">&#10094;</button>
          <Transition name="slide-fade" mode="out-in">
            <div class="carousel-card" :key="servicoAtual">
              <h3>{{ services[servicoAtual]?.title }}</h3>
              <p>{{ services[servicoAtual]?.description }}</p>
            </div>
          </Transition>

          <button class="carousel-arrow right" @click="proximoServico">&#10095;</button>
        </div>

        <!-- Indicadores -->
        <div class="carousel-dots">
    <span
        v-for="(p, index) in services"
        :key="index"
        :class="{ dot: true, active: index === servicoAtual }"
    ></span>
        </div>

        <!-- Localização -->
          <!-- Localização -->
          <div v-if="profile.location" class="map-container">
            <p>Localização</p>
            <iframe
                :src="profile.location"
                width="100%"
                height="226"
                style="border:0;"
                allowfullscreen=""
                loading="lazy"
            ></iframe>
          </div>


          <!-- Botão Fale Conosco -->
        <div class="contact-button-container">
          <button class="link-button">
            <i class="fa-solid fa-phone"></i> Fale conosco
          </button>
        </div>

      </div>

      </div>
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
  height: 70px;
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
  height: 4px;
  background-color: white;
  border-radius: 3px;
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
  font-size: 32px;
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

.product-image {
  width: 296px;
  height: 195px;
  object-fit: contain;
  border-radius: 12px;
  margin-top: 15px;
  margin-bottom: 15px;
  background: none;
}

.map-container {
  background: white;
  padding: 20px 20px 20px 20px;
  border-radius: 10px;
  margin-top: 20px;
}

.map-container p {
  margin-bottom: 10px;
}

.link-div{
  display: flex;
  align-items: center;
  justify-content: center;
}

.link-button{
  background: var(--accent);
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 35px;
  font-size: 18px;
  font-weight: bold;
  height: 50px;
  width: 200px;
  margin-top: 40px;
}

.empty {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 80vh;
  width: 100%;
  color: black;
  font-weight: bold;
  font-size: 16px;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.4s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(50px);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-50px);
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

.carousel-container {
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 0 20px;
}

.carousel-card {
  background-color: white;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  padding: 20px;
  width: 100%;
  max-width: 330px;
  text-align: left;
}

.carousel-card h3 {
  margin: 0 0 10px;
  font-weight: bold;
  text-align: center;
}

.carousel-card p {
  margin: 0;
  font-size: 14px;
  color: #333;
}

.carousel-arrow {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #fff !important;
}

.carousel-dots {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.dot {
  height: 6px;
  width: 34px;
  margin: 0 4px;
  background-color: #bbb;
  border-radius: 45px;
  display: inline-block;
}

.dot.active {
  background-color: #2897ca;
}

.contact-button-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px;
}


.link-button i {
  margin-right: 8px;
}

.icon-button i, .icon-button .fa-whatsapp, .icon-button .ti-brand-whatsapp {
  font-size: 35px !important;
  color: var(--accent) !important;
  width: 1em;
  height: 1em;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-card h3, .carousel-card p {
  color: #111 !important;
}

.map-container p {
  color: #111 !important;
  font-weight: bold;
}

</style>


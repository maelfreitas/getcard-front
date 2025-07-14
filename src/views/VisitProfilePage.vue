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
                <svg width="43" height="43" viewBox="0 0 43 43" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                  <rect width="43" height="43" fill="url(#pattern0_6_646)"/>
                  <defs>
                    <pattern id="pattern0_6_646" patternContentUnits="objectBoundingBox" width="1" height="1">
                      <use xlink:href="#image0_6_646" transform="scale(0.00195312)"/>
                    </pattern>
                    <image id="image0_6_646" width="512" height="512" preserveAspectRatio="none" xlink:href="data:image/png;base64,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"/>
                  </defs>
                </svg>

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



</style>


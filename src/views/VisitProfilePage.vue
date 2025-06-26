<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()

const cardCode = route.params.cardCode || ''

const profile = ref(null)
const errorMessage = ref('')
const loading = ref(true)

const goToLink = (url) => {
  if (url && !url.startsWith('http')) {
    url = 'https://' + url
  }
  window.open(url, '_blank')
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

  } catch (e) {
    errorMessage.value = 'Perfil não encontrado para este cartão.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="public-profile">
    <div v-if="loading" class="loading">Carregando...</div>

    <div v-else-if="errorMessage" class="error">{{ errorMessage }}</div>

    <div v-else-if="profile" class="card">
      <img v-if="profile.profileImageUrl" :src="profile.profileImageUrl" alt="Foto do perfil" class="profile-photo" />

      <h2>{{ profile.name }}</h2>
      <p class="bio">{{ profile.bio }}</p>

      <div class="actions">
        <button
            v-if="profile.phone"
            @click="goToLink(`https://wa.me/${profile.phone.replace(/\D/g, '')}`)"
            aria-label="WhatsApp"
            class="icon-button"
        >
          <svg
              class="icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
          >
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
        </button>

        <button
            v-if="profile.instagram"
            @click="goToLink(profile.instagram)"
            aria-label="Instagram"
            class="icon-button"
        >
          <svg
              class="icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
          >
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </button>

        <button
            v-if="profile.linkedin"
            @click="goToLink(profile.linkedin)"
            aria-label="LinkedIn"
            class="icon-button"
        >
          <svg
              class="icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
          >
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
          </svg>
        </button>

        <button
            v-if="profile.email"
            @click="goToLink(`mailto:${profile.email}`)
"
            aria-label="E-mail"
            class="icon-button"
        >
          <svg class="icon" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="122.879px" height="88.855px" viewBox="0 0 122.879 88.855" enable-background="new 0 0 122.879 88.855" xml:space="preserve"><g><path d="M7.048,0h108.784c1.939,0,3.701,0.794,4.977,2.069c1.277,1.277,2.07,3.042,2.07,4.979v74.759 c0,1.461-0.451,2.822-1.221,3.951c-0.141,0.365-0.361,0.705-0.662,0.994c-0.201,0.189-0.422,0.344-0.656,0.461 c-1.225,1.021-2.799,1.643-4.508,1.643H7.048c-1.937,0-3.701-0.793-4.979-2.07C0.794,85.51,0,83.748,0,81.807V7.048 c0-1.941,0.792-3.704,2.068-4.979C3.344,0.792,5.107,0,7.048,0L7.048,0z M5.406,78.842l38.124-38.22L5.406,9.538V78.842 L5.406,78.842z M47.729,44.045L8.424,83.449h105.701L76.563,44.051L64.18,54.602l0,0c-0.971,0.83-2.425,0.877-3.453,0.043 L47.729,44.045L47.729,44.045z M80.674,40.549l36.799,38.598V9.198L80.674,40.549L80.674,40.549z M8.867,5.406l53.521,43.639 l51.223-43.639H8.867L8.867,5.406z"/></g></svg>
        </button>
      </div>



      <div v-if="profile.experiences && profile.experiences.length > 0" class="experiences">
        <h3>Experiências</h3>
        <div class="experience-card" v-for="exp in profile.experiences" :key="exp.id">
          <p><strong>{{ exp.title }}</strong></p>
          <p>{{ exp.workplace }}</p>
          <p>{{ exp.location }}</p>
          <p>{{ exp.startYear }} - {{ exp.endYear }}</p>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.public-profile {
  min-height: 100vh;
  min-width: 412px;
  width: 100%;
  max-width: 500px;
  justify-content: center;
  align-items: center;
  color: white;
  font-family: Arial, sans-serif;
}

.card {
  background: #1a1a1a;
  padding: 0 2rem;
  border-radius: 16px;
  height: 100vh;
  text-align: center;
  box-shadow: 0 8px 16px rgba(0,0,0,0.3);
}

.profile-photo {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
  margin-top: 1rem;
  border: 3px solid #00ff99;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.bio {
  font-size: 1rem;
  color: #ccc;
  margin-bottom: 1.5rem;
  word-wrap: break-word;
}
.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
}

.icon-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
}

.icon-button:hover svg,
.icon-button:hover img {
  filter: brightness(0.8);
}

.icon {
  width: 32px;
  height: 32px;
  fill: #00ff99; /* Cor dos ícones SVG */
  transition: filter 0.3s;
}



.experiences {
  text-align: left;
  margin-top: 1.5rem;
}

.experiences ul {
  padding: 0;
  list-style: none;
}

.experiences li {
  margin-bottom: 0.75rem;
}

.experiences {
  text-align: left;
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.experience-card {
  background: #2a2a2a;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  color: white;
}

.experience-card p {
  margin: 0.25rem 0;
  line-height: 1.4;
}


.loading {
  color: white;
}

.error {
  color: red;
  font-weight: bold;
  text-align: center;
  margin: 1rem;
}

@media (max-width: 480px) {
  .card {
    max-width: 90%;
  }

  .links{
    width: 30px;
    height: 30px;
  }
  .profile-photo {
    width: 150px;
    height: 150px;
  }

  h2 {
    font-size: 1.2rem;
  }

  .bio, .actions button {
    font-size: 0.9rem;
  }
}
</style>

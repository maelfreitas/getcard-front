<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()

const cardCode = route.params.cardCode

onMounted(async () => {
  try {
    const res = await api.get(`/check/${cardCode}`)
    if (res.data.associated) {
      router.replace(`/visit/${cardCode}`)
    } else {
      router.replace({ path: '/register', query: { cardCode } })
    }
  } catch (error) {
    alert('Cartão não encontrado.')
    router.replace('/')
  }
})
</script>

<template>
  <div>
    <p>Verificando cartão...</p>
  </div>
</template>

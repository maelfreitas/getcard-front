<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import api from "@/services/api";

const route = useRoute();
const cardCode = route.params.cardCode;
const profile = ref(null);
const errorMessage = ref("");

onMounted(async () => {
  try {
    const response = await api.get(`/profile/public/${cardCode}`);
    profile.value = response.data;
  } catch (error) {
    errorMessage.value = "Perfil não encontrado";
  }
});
</script>

<template>
  <div v-if="profile">
    <h1>{{ profile.name }}</h1>
    <p>{{ profile.bio }}</p>
    <p>{{ profile.phone }}</p>
    <a :href="profile.links" target="_blank">Links</a>
    <img v-if="profile.imageUrl" :src="profile.imageUrl" alt="Foto de Perfil">
  </div>
  <p v-else>{{ errorMessage }}</p>
</template>

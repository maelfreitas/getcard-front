<script setup>
import { ref, onMounted } from "vue";
import api from "@/services/api";
import { useRouter } from "vue-router";

const fullName = ref("");
const bio = ref("");
const phone = ref("");
const links = ref("");
const imageUrl = ref("");
const errorMessage = ref("");
const router = useRouter();

onMounted(async () => {
  try {
    const response = await api.get("/profile/me", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    const profile = response.data;
    fullName.value = profile.fullName;
    bio.value = profile.bio;
    phone.value = profile.phone;
    links.value = profile.links;
    imageUrl.value = profile.imageUrl;
  } catch (error) {
    errorMessage.value = "Erro ao carregar perfil";
  }
});

const updateProfile = async () => {
  try {
    await api.put(
        "/profile/me",
        {
          fullName: fullName.value,
          bio: bio.value,
          phone: phone.value,
          links: links.value,
          imageUrl: imageUrl.value,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
    );
    alert("Perfil atualizado com sucesso!");
    router.push("/dashboard");
  } catch (error) {
    errorMessage.value = "Erro ao salvar perfil";
  }
};
</script>

<template>
  <div>
    <h1>Editar Perfil</h1>
    <form @submit.prevent="updateProfile">
      <label>Nome completo:</label>
      <input v-model="fullName" type="text" />

      <label>Bio:</label>
      <textarea v-model="bio"></textarea>

      <label>Telefone:</label>
      <input v-model="phone" type="text" />

      <label>Links:</label>
      <input v-model="links" type="text" />


      <label>URL da Imagem:</label>
      <input v-model="imageUrl" type="text" />

      <button type="submit">Salvar</button>
    </form>
    <p v-if="errorMessage">{{ errorMessage }}</p>
  </div>
</template>

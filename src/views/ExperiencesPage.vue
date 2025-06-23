<script setup>
import { ref, onMounted } from "vue";
import api from "@/services/api";
import { useRoute } from "vue-router";

const route = useRoute();
const profileId = route.params.profileId; // Vamos pegar o profileId da rota

const experiences = ref([]);
const newExperience = ref({
  title: "",
  workplace: "",
  location: "",
  startYear: "",
  endYear: "",
});
const errorMessage = ref("");

const loadExperiences = async () => {
  try {
    const response = await api.get(`/experience/list/${profileId}`);
    experiences.value = response.data;
  } catch (error) {
    console.error("Erro ao carregar experiências:", error);
  }
};

const addExperience = async () => {
  try {
    await api.post(`/experience/add/${profileId}`, newExperience.value);
    newExperience.value = { title: "", workplace: "", location: "", startYear: "", endYear: "" };
    await loadExperiences();
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "Erro ao adicionar experiência!";
  }
};

const deleteExperience = async (experienceId) => {
  try {
    await api.delete(`/experience/${experienceId}`);
    await loadExperiences();
  } catch (error) {
    console.error("Erro ao excluir experiência:", error);
  }
};

onMounted(() => {
  loadExperiences();
});
</script>

<template>
  <div class="experience-container">

    <h2>Minhas Experiências</h2>

    <div v-if="experiences.length === 0">
      Nenhuma experiência cadastrada.
    </div>

    <ul>
      <li v-for="exp in experiences" :key="exp.id">
        <strong>{{ exp.title }}</strong> - {{ exp.workplace }} ({{ exp.startYear }} - {{ exp.endYear }}) - {{ exp.location }}
        <button @click="deleteExperience(exp.id)">Excluir</button>
      </li>
    </ul>

    <h3>Adicionar Nova Experiência</h3>
    <form @submit.prevent="addExperience">
      <div>
        <label>Título:</label>
        <input v-model="newExperience.title" required />
      </div>

      <div>
        <label>Local de Trabalho:</label>
        <input v-model="newExperience.workplace" required />
      </div>

      <div>
        <label>Localização:</label>
        <input v-model="newExperience.location" required />
      </div>

      <div>
        <label>Ano de Início:</label>
        <input v-model.number="newExperience.startYear" type="number" required />
      </div>

      <div>
        <label>Ano de Fim:</label>
        <input v-model.number="newExperience.endYear" type="number" required />
      </div>

      <button type="submit">Adicionar Experiência</button>
    </form>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<style scoped>
.experience-container {
  max-width: 600px;
  margin: 0 auto;
}

form div {
  margin-bottom: 10px;
}

button {
  margin-top: 10px;
}

.error {
  color: red;
  margin-top: 10px;
}
</style>

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
    <div class="card">


      <h3>Adicionar Nova Experiência</h3>
      <form @submit.prevent="addExperience" class="experience-form">
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


      <div v-if="experiences.length === 0" class="empty">
        Nenhuma experiência cadastrada.
      </div>

      <div v-else class="experience-list">
        <div v-for="exp in experiences" :key="exp.id" class="experience-card">
          <p><strong>{{ exp.title }}</strong></p>
          <p>{{ exp.workplace }}</p>
          <p>{{ exp.location }}</p>
          <p>{{ exp.startYear }} - {{ exp.endYear }}</p>
          <button class="danger" @click="deleteExperience(exp.id)">Excluir</button>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.experience-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background-color: #1a1a1a;
  color: white;
  font-family: Arial, sans-serif;
  padding: 2rem 1rem;
}

.card {
  background: #1a1a1a;
  padding: 2rem;
  border-radius: 16px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

h2, h3 {
  color: #00ff99;
  text-align: center;
  margin-bottom: 1.5rem;
}

.experience-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.experience-card {
  background: #2a2a2a;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.experience-card p {
  margin: 0.25rem 0;
  line-height: 1.4;
}

.empty {
  text-align: center;
  color: #ccc;
  margin-bottom: 2rem;
}

.experience-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

label {
  font-weight: bold;
  color: #00ff99;
}

input {
  width: 100%;
  padding: 0.75rem;
  background-color: #2a2a2a;
  border: 1px solid #444;
  color: white;
  border-radius: 8px;
  box-sizing: border-box;
  font-size: 1rem;
  transition: border-color 0.3s;
}

input:focus {
  border-color: #00ff99;
  outline: none;
}

button {
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  transition: background-color 0.3s;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  background-color: #00ff99;
  color: #1a1a1a;
}

button:hover {
  background-color: #00cc7a;
  color: white;
}

button.danger {
  background-color: #dc3545;
  color: white;
}

button.danger:hover {
  background-color: #c82333;
}

.error {
  color: red;
  background-color: #330000;
  padding: 0.75rem;
  border-radius: 8px;
  font-weight: bold;
  margin-top: 1rem;
}
</style>

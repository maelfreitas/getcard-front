<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import api from "@/services/api"; // Certifique-se de que esse arquivo está configurado para apontar pro seu backend

const username = ref("");
const email = ref("");
const password = ref("");
const passwordConfirmation = ref("");
const errorMessage = ref("");
const router = useRouter();
const route = useRoute();

// Captura o cardCode da URL
const cardCode = ref(route.query.cardCode || "");
const valCode = ref("");

const register = async () => {
  errorMessage.value = "";

  if (password.value !== passwordConfirmation.value) {
    errorMessage.value = "As senhas não coincidem!";
    return;
  }

  try {
    const response = await api.post("/auth/register", {
      user: {
        username: username.value,
        email: email.value,
        password: password.value,
      },
      cardCode: cardCode.value,
      valCode: valCode.value
    });

    // Opcional: armazenar token, se o backend estiver retornando
    // localStorage.setItem("token", response.data.token);

    router.push("/login");
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage.value = error.response.data.message;
    } else {
      errorMessage.value = "Erro ao registrar usuário.";
    }
  }
};
</script>

<template>
  <div class="row-login">
    <div id="main-container">
      <h1>Cadastre-se para acessar o sistema</h1>
      <form id="register-form" @submit.prevent="register">
        <div class="full-box">
          <label for="email">E-mail</label>
          <input v-model="email" type="email" id="email" placeholder="Digite seu e-mail" required />
        </div>

        <div class="full-box">
          <label for="username">Nome</label>
          <input v-model="username" type="text" id="username" placeholder="Digite seu nome" required />
        </div>

        <div class="half-box spacing">
          <label for="password">Senha</label>
          <input v-model="password" type="password" id="password" placeholder="Digite sua senha" required />
        </div>

        <div class="half-box">
          <label for="passconfirmation">Confirmação</label>
          <input v-model="passwordConfirmation" type="password" id="passwordConfirmation"
                 placeholder="Digite novamente sua senha" required />
        </div>
        <div class="full-box">
          <label for="valCode">Código de Validação</label>
          <input v-model="valCode" type="text" id="valCode" placeholder="Digite o código de validação">
        </div>
        <div class="agreement-container">
          <input type="checkbox" name="agreement" id="agreement" required />
          <label for="agreement" id="agreement-label">
            Eu li e aceito os <a href="#">termos de uso</a>
          </label>
        </div>

        <!-- Exibir erro -->
        <p v-if="errorMessage" class="error" style="color: red;">{{ errorMessage }}</p>

        <div class="full-box">
          <input id="btn-submit" type="submit" value="Registrar" />
        </div>

        <div class="col-12" id="link-container">
          <router-link to="/login">Já tenho uma conta</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
*,
*::after,
*::before {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  text-decoration: none;
}

.row-login {
  display: flex;
  flex-wrap: wrap;
  height: 100vh;
  width: 100vw;
  background-color: rgba(29, 33, 40, 0.8);
}

#main-container {
  width: auto;
  max-width: 600px;
  margin: auto auto;
  padding: 20px;
  text-align: center;
}

#main-container h1 {
  font-family: 'Roboto', sans-serif;
  color: #3498db;
  margin-bottom: 20px;
}

#register-form {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.full-box, .half-box {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
}

.half-box {
  width: calc(50% - 20px);
}

.half-box.spacing {
  margin-right: 20px;
}

#register-form label {
  display: block;
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  text-align: left;
}

#register-form input[type="email"],
#register-form input[type="text"],
#register-form input[type="password"] {
  width: 100%;
  padding: 18px;
  margin-top: 5px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

#register-form input[type="checkbox"] {
  vertical-align: middle;
  margin: 0;
}

#register-form input[type="submit"] {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
  font-weight: bold;
  width: 100%;
}

#register-form input[type="submit"]:hover {
  background-color: #2980b9;
}

.agreement-container {
  display: flex;
  align-items: center;
  padding: 10px;
}

#agreement-label {
  font-size: 14px;
  margin: 0;
}

#agreement-label a {
  color: #2980b9;
  text-decoration: none;
}

#agreement-label a:hover {
  text-decoration: underline;
}


#link-container {
  margin-top: 20px;
  text-align: center;
  width: 100%;
}

#link-container a {
  color: #2980b9;
  text-decoration: none;
  font-weight: bold;
}

#link-container a:hover {
  text-decoration: underline;
}

.error {
  color: red;
  margin-top: 10px;
}

</style>
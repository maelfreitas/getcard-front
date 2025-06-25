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
const emailExists = ref(false);
const valCodeValid = ref(true);
const showSuccessPopup = ref(false);

// Captura o cardCode da URL
const cardCode = ref(route.query.cardCode || "");
const valCode = ref("");

const checkEmail = async () => {
  if (!email.value) return
  try {
    const res = await api.get('/auth/check-email', {
      params: { email: email.value }
    })
    emailExists.value = res.data
  } catch (err) {
    emailExists.value = false
  }
}

const checkValCode = async () => {
  if (!cardCode.value || !valCode.value) return;

  try {
    const res = await api.get('/check/check-valcode', {
      params: {
        code: cardCode.value,
        valCode: valCode.value
      }
    });
    valCodeValid.value = res.data;
  } catch (err) {
    valCodeValid.value = false;
  }
}

const handlePopupConfirm = () => {
  showSuccessPopup.value = false
  router.push('/login')
}


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
    showSuccessPopup.value = true;

  } catch (error) {
    if (error.response) {
      // Verifica se é string pura (mensagem direta do backend)
      if (typeof error.response.data === 'string') {
        errorMessage.value = error.response.data
      }
      // Verifica se é objeto com a chave message
      else if (error.response.data.message) {
        errorMessage.value = error.response.data.message
      } else {
        errorMessage.value = "Erro ao registrar usuário."
      }
    } else {
      errorMessage.value = "Erro ao registrar usuário."
    }
  }

};
</script>

<template>
  <div class="row-login">
    <div id="main-container">
      <h1>Cadastre-se para acessar o sistema</h1>
      <div v-if="showSuccessPopup" class="popup-overlay">
        <div class="popup-content">
          <p>Cadastro realizado com sucesso!</p>
          <button @click="handlePopupConfirm">OK</button>
        </div>
      </div>

      <form id="register-form" @submit.prevent="register">
        <div class="full-box">
          <label for="email">E-mail</label>
          <input v-model="email" @blur="checkEmail" type="email" id="email" placeholder="Digite seu e-mail" required />
          <p v-if="emailExists" class="error">Este e-mail já está cadastrado! Insira outro.</p>
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
          <input v-model="valCode" @blur="checkValCode" type="text" id="valCode" placeholder="Digite o código de validação">
          <p v-if="!valCodeValid" class="error">Código de validação inválido para este cartão!</p>
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

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.popup-content {
  background: white;
  padding: 30px 40px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.popup-content p {
  font-size: 1.2rem;
  margin-bottom: 20px;
  color: #2ecc71;
}

.popup-content button {
  padding: 10px 20px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.popup-content button:hover {
  background-color: #2980b9;
}


.error {
  color: red;
  margin-top: 10px;
}


</style>
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
  <div class="login-page">
    <!-- Círculos decorativos -->
    <div class="circle big"></div>
    <div class="circle small"></div>

    <!-- Conteúdo principal -->
    <div class="content">
      <h1 class="title">Cadastrar</h1>

      <!-- POPUP DE SUCESSO -->
      <div v-if="showSuccessPopup" class="popup-overlay">
        <div class="popup-content">
          <p>Cadastro realizado com sucesso!</p>
          <button @click="handlePopupConfirm">OK</button>
        </div>
      </div>

      <form @submit.prevent="register">
        <div class="input-field">
          <img class="icon" src="../assets/user-icon.png">
          <input v-model="username" type="text" placeholder="Nome" required />
        </div>

        <div class="input-field">
          <img class="icon" src="../assets/locker-icon.png">
          <input v-model="valCode" @blur="checkValCode" type="text" id="valCode" placeholder="Código de validação" required />
        </div>
        <p v-if="!valCodeValid" class="error">Código de validação inválido para este cartão!</p>

        <div class="input-field">
          <img class="icon" src="../assets/email-icon.png">
          <input v-model="email" @blur="checkEmail" type="email" placeholder="Email" required />
        </div>
        <p v-if="emailExists" class="error">Este e-mail já está cadastrado! Insira outro.</p>

        <div class="input-field">
          <img class="icon" src="../assets/key-icon.png">
          <input v-model="password" type="password" placeholder="Senha" required />
        </div>

        <div class="input-field">
          <img class="icon" src="../assets/key-icon.png">
          <input v-model="passwordConfirmation" type="password" placeholder="Confirmar senha" id="passwordConfirmation" required />
        </div>

        <div class="agreement-container">
          <input type="checkbox" name="agreement" id="agreement" required />
          <label for="agreement" id="agreement-label">
            Eu li e aceito os <a href="#">termos de uso</a>
          </label>
        </div>

        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

        <button class="login-btn" type="submit">Cadastrar</button>
      </form>
    </div>

    <!-- Curva inferior -->
    <div class="curve"></div>
  </div>
</template>




<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
.login-page {
  position: relative;
  height: 100vh;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Poppins', sans-serif;
  overflow: hidden;
}

.content {
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100vh;
  z-index: 2;
  width: 100%;
  max-width: 320px;
  text-align: center;

}

.title {
  font-size: 50px;
  font-weight: 800;
  text-align: start;
  margin-bottom: 80px;
  margin-top: 140px;
  color: #3F3F3F;
}

.input-field {
  display: flex;
  align-items: center;
  border: 1.5px solid #000;
  border-radius: 999px;
  padding: 10px 16px;
  margin-bottom: 20px;
  margin-right: 20px;
  margin-left: 20px;
  background-color: white;
}

.input-field .icon {
  margin-right: 10px;
  font-size: 18px;
  width: 24px;
  height: 24px;
}

.input-field input {
  border: none;
  outline: none;
  flex: 1;
  font-size: 16px;
  background: transparent;
  color: #3F3F3F;
  padding-left: 15px;
  font-weight: bold;
}


.login-btn {
  width: 75%;
  padding: 12px;
  font-size: 28px;
  font-weight: 800;
  color: #3F3F3F;
  background-color: white;
  border: 1px solid #000;
  border-radius: 999px;
  cursor: pointer;
  margin-top: 110px;
}

.error {
  color: red;
  margin-bottom: 10px;
  font-size: 14px;
}

.register {
  margin-top: 18px;
  font-size: 14px;
  color: white;
}

.register a {
  font-weight: bold;
  color: white;
  text-decoration: none;
}

.circle {
  position: absolute;
  border-radius: 50%;
  z-index: 1;
}

.big {
  width: 200px;
  height: 200px;
  background: #3FBFFA;
  top: -50px;
  right: -50px;
}

.small {
  width: 100px;
  height: 100px;
  background: #2897CA;
  top: 90px;
  right: -50px;
}

.curve {
  position: absolute;
  border-radius: 50%;
  bottom: -480px;
  width: 700px;
  height: 700px;
  background: #2897CA;
  z-index: 0;
}

.agreement-container {
  display: flex;
  align-items: center;
  padding-left: 30px;
  color: #3F3F3F;
}

#agreement-label {
  font-size: 14px;
  margin-left: 3px;
}

#agreement-label a {
  color: #2980b9;
  text-decoration: none;
}

#agreement-label a:hover {
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

</style>


<script setup>
import {ref} from "vue";
import {useRouter} from "vue-router";
import api from "@/services/api"; // Certifique-se de que esse arquivo está configurado


const email = ref("");
const password = ref("");
const errorMessage = ref("");
const router = useRouter();



const login = async () => {
  try {
    const response = await api.post("/auth/login", {
      email: email.value,
      password: password.value,
    });

    localStorage.setItem("token", response.data.token);
    localStorage.setItem("userId", response.data.userId);
    localStorage.setItem("userName", response.data.userName);
    router.push("/dashboard");
  } catch (error) {
    errorMessage.value = "E-mail ou senha incorretos!";
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
      <h1 class="title">Login</h1>

      <form @submit.prevent="login">
        <div class="input-field">
          <span class="icon">📧</span>
          <input v-model="email" type="email" placeholder="Email" required />
        </div>

        <div class="input-field">
          <span class="icon">🔑</span>
          <input v-model="password" type="password" placeholder="Senha" required />
        </div>

        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        <button class="login-btn" type="submit">Login</button>
      </form>

      <p class="register">
        Não tem uma conta?
        <a href="#">Cadastrar</a>
      </p>
    </div>

    <!-- Curva inferior -->
    <div class="curve"></div>
  </div>
</template>



<style scoped>
.login-page {
  position: relative;
  height: 100vh;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Arial', sans-serif;
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
  font-weight: bold;
  text-align: start;
  margin-bottom: 100px;
  margin-top: 140px;
  color: #333;
}

.input-field {
  display: flex;
  align-items: center;
  border: 1.5px solid #000;
  border-radius: 999px;
  padding: 10px 16px;
  margin-bottom: 20px;
  background-color: white;
}

.input-field .icon {
  margin-right: 10px;
  font-size: 18px;
}

.input-field input {
  border: none;
  outline: none;
  flex: 1;
  font-size: 16px;
  background: transparent;
  color: #333;
}

.login-btn {
  width: 100%;
  padding: 12px;
  font-size: 18px;
  font-weight: bold;
  color: #333;
  background-color: white;
  border: 2px solid #000;
  border-radius: 999px;
  cursor: pointer;
  margin-top: 100px;
}

.error {
  color: red;
  margin-bottom: 10px;
  font-size: 14px;
}

.register {
  margin-top: 18px;
  font-size: 14px;
  color: #333;
}

.register a {
  font-weight: bold;
  color: #333;
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
  background: #29b6f6;
  top: -50px;
  right: -50px;
}

.small {
  width: 100px;
  height: 100px;
  background: #0288d1;
  top: 90px;
  right: -50px;
}

.curve {
  position: absolute;
  border-radius: 50%;
  bottom: -400px;
  width: 700px;
  height: 700px;
  background: #29b6f6;
  right: -50px;
  z-index: 0;
}
</style>


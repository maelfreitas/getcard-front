<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
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
    router.push("/register");
  } catch (error) {
    errorMessage.value = "E-mail ou senha incorretos!";
  }
};
</script>

<template>
  <div class="row-login" >

      <div id="login-container">
        <h1>Faça o login</h1>
        <form @submit.prevent="login">
          <label for="email">E-mail</label>
          <input v-model="email" type="email" id="email" placeholder="Digite seu e-mail" autocomplete="off" required />

          <label for="password">Senha</label>
          <input v-model="password" type="password" id="password" placeholder="Digite sua senha" required />

          <a href="#" id="forgot-pass">Esqueceu a senha?</a>

          <button type="submit">Entrar</button>
          <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        </form>

        <div id="register-container">
          <p>Ainda não tem uma conta?</p>
          <router-link to="/register">Registrar</router-link>
        </div>
      </div>
    </div>



</template>

<style scoped>
*,
*::after,
*::before{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  text-decoration: none;
}

.row-login{
  display: flex;
  flex-wrap: wrap;
  height: 100vh;
  width: 100vw;
  background-color: rgba(29, 33, 40, 0.8);
}


#login-container {
  width: 400px;
  max-width: 400px;
  max-height: 500px;
  margin: auto auto;
  padding: 20px;
  border: none;
  text-align: center;

}

#login-container h1 {
  font-family: 'Roboto', sans-serif;
  color: #3498db;
  margin-bottom: 20px;
}

#login-container form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#login-container label {
  font-family: 'Roboto', sans-serif;
  margin-top: 10px;
  font-weight: 500;
  align-self: flex-start;
}

#login-container input[type="email"],
#login-container input[type="password"] {
  width: 100%;
  padding: 18px;
  margin-top: 5px;
  margin-bottom: 18px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

#login-container button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
  font-weight: bold;
}

#login-container button:hover {
  background-color: #2980b9;
}

#forgot-pass {
  color: #c3bfbf;
  text-decoration: none;
  font-size: 14px;
  margin-top: 10px;
  display: block;
  text-align: right;
  width: 100%;
}

#forgot-pass:hover {
  text-decoration: underline;
}

#register-container {
  margin-top: 20px;
}

#register-container a {
  color: #2980b9;
  text-decoration: none;
  font-weight: bold;
}

#register-container a:hover {
  text-decoration: underline;
}

.error {
  color: red;
  margin-top: 10px;
}

</style>

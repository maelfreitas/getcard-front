<template>
  <div class="welcome-container">
    <div class="welcome-card">
      <!-- Logo da UEMA -->
      <div class="logo">
        <img src="@/assets/logo.png" alt="Logo UEMA" class="logo-img" />
      </div>
      <!-- Nome do App -->
      <h1 class="app-name">Geticard</h1>
      <!-- Descrição -->
      <p class="tagline">Sua identidade profissional, digital e acessível.</p>
      <!-- Botões de Login e Cadastro -->
      <div class="button-container">
        <router-link to="/signup">
          <button class="signup-button">Sign Up</button>
        </router-link>
        <router-link to="/login">
          <button class="login-button">Log In</button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Welcome',
};
</script>

<style scoped>
.welcome-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5; /* Cor de fundo suave */
}

.welcome-card {
  background: white;
  padding: 40px;
  border-radius: 20px;
  width: 100%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1); /* Sombra mais suave */
}

.logo-img {
  width: 120px;
  margin-bottom: 20px;
}

.app-name {
  font-size: 32px;
  color: #333;
  font-weight: bold;
  margin-bottom: 10px;
}

.tagline {
  font-size: 16px;
  color: #888;
  margin-bottom: 30px;
}

.button-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.signup-button, .login-button {
  width: 100%;
  padding: 15px;
  font-size: 18px;
  border-radius: 25px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.signup-button {
  background-color: #2575fc; /* Cor azul para o botão Sign Up */
  color: white;
}

.signup-button:hover {
  background-color: #6a11cb; /* Azul escuro quando hover */
}

.login-button {
  background-color: #f1f1f1;
  color: #2575fc;
  border: 1px solid #2575fc;
}

.login-button:hover {
  background-color: #e0e0e0; /* Cor mais clara ao passar o mouse */
}

/* Melhorias na responsividade */
@media screen and (max-width: 480px) {
  .welcome-card {
    padding: 25px;
    max-width: 90%;
  }

  .app-name {
    font-size: 28px;
  }

  .tagline {
    font-size: 14px;
  }

  .signup-button, .login-button {
    font-size: 16px;
    padding: 12px;
  }
}
</style>

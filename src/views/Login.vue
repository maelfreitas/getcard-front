<template>
  <div class="login-container">
    <div class="login-card">
      <div class="logo">
        <img src="@/assets/logo.png" alt="Logo" class="logo-img" /> <!-- Logo -->
      </div>
      <h2 class="title">Welcome back!</h2>
      <form @submit.prevent="handleSubmit">
        <div class="input-group">
          <input type="text" v-model="username" placeholder="Username" required />
        </div>
        <div class="input-group">
          <input type="password" v-model="password" placeholder="Password" required />
        </div>
        <div class="remember-forget">
          <label>
            <input type="checkbox" v-model="rememberMe" /> Remember me
          </label>
          <router-link to="/forgot-password" class="forget-password">Forget password?</router-link>
        </div>
        <button type="submit" class="login-button">Login</button>
      </form>
      <div class="signup-link">
        <p>New user? <router-link to="/signup">Sign Up</router-link></p>
      </div>
      <div class="social-links">
        <a href="#" class="social-icon"><i class="fab fa-facebook"></i></a>
        <a href="#" class="social-icon"><i class="fab fa-google"></i></a>
        <a href="#" class="social-icon"><i class="fab fa-linkedin"></i></a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
      rememberMe: false,
    };
  },
  methods: {
    handleSubmit() {
      console.log('Logging in with:', this.username, this.password);
      // Aqui você pode adicionar a lógica de login
    },
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(to top, #6a11cb, #2575fc); /* Gradiente de azul para roxo */
}

.login-card {
  background: white;
  padding: 40px;
  border-radius: 20px;
  width: 100%;
  max-width: 380px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.logo-img {
  width: 80px;
  margin-bottom: 20px;
}

h2.title {
  font-size: 28px;
  color: #333;
  margin-bottom: 30px;
}

.input-group {
  margin-bottom: 15px;
}

.input-group input {
  width: 100%;
  padding: 12px;
  margin: 8px 0;
  border-radius: 25px;
  border: 1px solid #ddd;
  font-size: 16px;
}

.input-group input:focus {
  outline: none;
  border-color: #2575fc;
}

.remember-forget {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

.remember-forget .forget-password {
  color: #2575fc;
}

.login-button {
  width: 100%;
  padding: 15px;
  background-color: #2575fc;
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 18px;
  cursor: pointer;
  margin-top: 20px;
}

.login-button:hover {
  background-color: #6a11cb;
}

.signup-link {
  margin-top: 20px;
}

.signup-link a {
  color: #2575fc;
  text-decoration: none;
}

.social-links {
  margin-top: 20px;
}

.social-icon {
  margin: 0 10px;
  font-size: 20px;
  color: #333;
}

.social-icon:hover {
  color: #2575fc;
}
</style>

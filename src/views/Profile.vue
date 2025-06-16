<template>
  <div class="profile-container">
    <div class="profile-card">
      <!-- Imagem de Perfil -->
      <div class="profile-header">
        <img class="profile-img" :src="profileImage" alt="Profile Image" />
      </div>

      <!-- Informações principais do usuário -->
      <div class="profile-details">
        <h2>{{ name }}</h2>
        <p class="profession">{{ profession }}</p>
        <p class="bio">{{ bio }}</p>
      </div>

      <!-- Redes sociais -->
      <div class="social-icons">
        <a href="#" class="social-icon"><i class="fab fa-instagram"></i></a>
        <a href="#" class="social-icon"><i class="fab fa-twitter"></i></a>
        <a href="#" class="social-icon"><i class="fab fa-linkedin"></i></a>
        <a href="#" class="social-icon"><i class="fas fa-share-alt"></i></a>
      </div>

      <!-- Seção de Experiência -->
      <div class="experience">
        <h3>Experiência</h3>
        <div class="experience-item">
          <i class="fas fa-briefcase"></i>
          <div>
            <p class="position">Estoque / Vendedor</p>
            <p class="company">S-Mart - Jackson, Michigan</p>
            <p class="date">1981 - Presente</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Profile',
  data() {
    return {
      profileImage: 'https://example.com/path-to-image.jpg', // Substitua pelo caminho correto da imagem
      name: 'Ash J. Williams',
      profession: 'Profissional em Sobrevivência Extrema',
      bio: 'Especialista em combate sobrenatural, Ash Williams é resiliente, ágil sob pressão e experiente em sobrevivência, contenção de ameaças e uso de artefatos místicos como o Necronomicon.',
    };
  },
};
</script>

<style scoped>
.profile-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Garante que o container use a altura total da tela */
  background-color: #f0f0f0;
  padding: 15px;
}

.profile-card {
  width: 100%;
  max-width: 380px;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.profile-header {
  margin-bottom: 20px;
}

.profile-img {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #2575fc;
}

.profile-details h2 {
  font-size: 22px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.profession {
  font-size: 14px;
  color: #888;
  margin-bottom: 15px;
}

.bio {
  font-size: 14px;
  color: #666;
  margin-bottom: 25px;
}

.social-icons {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
}

.social-icon {
  font-size: 20px;
  color: #333;
  text-decoration: none;
  transition: color 0.3s ease;
}

.social-icon:hover {
  color: #2575fc;
}

.experience {
  text-align: left;
}

.experience h3 {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
}

.experience-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.experience-item i {
  font-size: 18px;
  color: #2575fc;
  margin-right: 10px;
}

.position {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.company {
  font-size: 14px;
  color: #888;
}

.date {
  font-size: 12px;
  color: #666;
}

/* Responsividade para dispositivos menores */
@media (max-width: 600px) {
  .profile-card {
    max-width: 95%;
    padding: 15px;
  }

  .profile-img {
    width: 80px;
    height: 80px;
  }

  .profile-details h2 {
    font-size: 20px;
  }

  .profession {
    font-size: 12px;
  }

  .bio {
    font-size: 12px;
  }

  .social-icons {
    gap: 10px;
  }

  .social-icon {
    font-size: 18px;
  }

  .experience h3 {
    font-size: 16px;
  }

  .experience-item {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>

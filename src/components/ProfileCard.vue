<template>
  <div class="profile-card">
    <!-- Profile Header -->
    <div class="profile-header">
      <div class="profile-image">
        <img :src="profile.profileImageUrl || 'default-profile-image.png'" alt="Profile Image" />
      </div>
      <div class="profile-details">
        <h1>{{ profile.user.name }}</h1>
        <p class="position">{{ profile.position || 'Position' }}</p>
        <p class="company-name">{{ profile.companyName || 'Company Name' }}</p>
        <p class="description">{{ profile.bio || 'Personal description' }}</p>
      </div>
    </div>

    <!-- Profile Contact Info -->
    <div class="profile-contact">
      <div class="contact-item">
        <i class="fas fa-phone-alt"></i>
        <span>{{ profile.phone || 'Phone' }}</span>
      </div>
      <div class="contact-item">
        <i class="fas fa-envelope"></i>
        <span>{{ profile.email || 'Email' }}</span>
      </div>
      <div class="contact-item">
        <i class="fas fa-globe"></i>
        <span>{{ profile.website || 'Website' }}</span>
      </div>
    </div>

    <!-- Save to Contacts Button -->
    <div class="save-button">
      <button @click="saveToContacts">Save to contacts</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Profile',
  data() {
    return {
      profile: null,
    };
  },
  mounted() {
    const { code } = this.$route.params;
    this.fetchProfile(code);
  },
  methods: {
    async fetchProfile(code) {
      try {
        const response = await axios.get(`http://localhost:8080/api/profile/${code}`);
        this.profile = response.data;
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    },
    saveToContacts() {
      // Logic for saving contact (can be custom for your application)
      alert('Contact saved!');
    },
  },
};
</script>

<style scoped>
.profile-card {
  max-width: 400px;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: #007bff;
  color: white;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.profile-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.profile-image img {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  margin-right: 20px;
}

.profile-details h1 {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
}

.profile-details .position,
.profile-details .company-name,
.profile-details .description {
  font-size: 14px;
  margin: 5px 0;
}

.profile-contact {
  margin-top: 20px;
}

.contact-item {
  display: flex;
  align-items: center;
  margin: 10px 0;
}

.contact-item i {
  margin-right: 10px;
  font-size: 18px;
}

.save-button button {
  background-color: white;
  color: #007bff;
  border: none;
  border-radius: 25px;
  padding: 10px 20px;
  font-size: 14px;
  cursor: pointer;
  margin-top: 20px;
}

.save-button button:hover {
  background-color: #f0f0f0;
}
</style>

<template>
  <div>
    <v-img
        class="mx-auto my-6"
        max-width="58"
        src="/logo.png"
    ></v-img>

    <v-card
        class="mx-auto pa-12 pb-8"
        elevation="8"
        max-width="448"
        rounded="lg"
    >
      <div class="text-h6 text-medium-emphasis mb-4">Update Temporary Password</div>

      <v-text-field
          v-model="tempPassword"
          :append-inner-icon="visibleTemp ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visibleTemp ? 'text' : 'password'"
          density="compact"
          placeholder="Enter temporary password"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          @click:append-inner="visibleTemp = !visibleTemp"
      ></v-text-field>

      <v-text-field
          v-model="newPassword"
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'"
          density="compact"
          placeholder="Enter new password"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          @click:append-inner="visible = !visible"
      ></v-text-field>

      <v-text-field
          v-model="confirmPassword"
          :append-inner-icon="visible2 ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible2 ? 'text' : 'password'"
          :error-messages="passwordError"
          density="compact"
          placeholder="Confirm new password"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          @click:append-inner="visible2 = !visible2"
          @input="validatePasswords"
      ></v-text-field>

      <v-alert
          v-if="passwordError"
          type="error"
          class="mb-4"
          density="compact"
      >
        {{ passwordError }}
      </v-alert>

      <v-alert
          v-if="error"
          type="error"
          class="mb-4"
          density="compact"
      >
        {{ error }}
      </v-alert>
      
      <v-btn
          @click="handleSubmit"
          class="mb-8"
          color="blue"
          size="large"
          variant="tonal"
          block
          :disabled="!!passwordError || !newPassword || !confirmPassword || !tempPassword"
      >
        Update Password
      </v-btn>

    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { navigateTo } from "nuxt/app";
import { useUserStore } from '~/stores/userStore';

const visible = ref(false)
const visible2 = ref(false)
const visibleTemp = ref(false)
const tempPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const passwordError = ref('');
const error = ref('');

// Initialize user store
const userStore = useUserStore();
userStore.initialize();

// Configure your API base URL
const API_BASE_URL = 'http://localhost:3100';

const validatePasswords = () => {
  if (newPassword.value !== confirmPassword.value) {
    passwordError.value = 'Passwords do not match';
  } else {
    passwordError.value = '';
  }
}

const handleSubmit = async () => {
  error.value = '';
  try {
    const response = await fetch(`${API_BASE_URL}/login/changeTempPassword`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: userStore.mail,
        tempPassword: tempPassword.value,
        newPassword: newPassword.value
      }),
    });

    if (response.ok) {
      const result = await response.json();
      // Update user store with new credentials if needed
      await userStore.login(result.userKey || userStore.userKey, userStore.mail, userStore.role);
      navigateTo('/panelAdmin');
    } else {
      const errorData = await response.json();
      error.value = errorData.message || 'Password update failed';
      console.error('Password update failed:', response.status, errorData);
    }

  } catch (error) {
    console.error('Network error during password update:', error);
  }
};
</script>
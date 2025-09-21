<!-- LoginForm.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import { navigateTo } from 'nuxt/app'
import { useUserStore } from '~/stores/userStore'

const visible = ref(false)
const email = ref('')
const password = ref('')
const userStore = useUserStore()
const error = ref('')

userStore.initialize()
const API_BASE_URL = 'http://localhost:3100'

// Establecer un temporizador para cerrar la sesión automáticamente
// después de un tiempo de inactividad (8 horas)
let sessionTimeout: NodeJS.Timeout | null = null

// Función para configurar el temporizador de sesión
const setSessionTimeout = () => {
  // Limpiar cualquier temporizador existente
  if (sessionTimeout) {
    clearTimeout(sessionTimeout)
  }
  
  // Configurar para expirar después de 8 horas (el mismo tiempo que el token JWT)
  // 8 horas * 60 minutos * 60 segundos * 1000 milisegundos
  const SESSION_DURATION = 8 * 60 * 60 * 1000
  
  sessionTimeout = setTimeout(() => {
    userStore.logout()
    navigateTo('/login')
  }, SESSION_DURATION)
}

// Reiniciar el temporizador en eventos de actividad
const resetSessionTimer = () => {
  if (userStore.isAuthenticated) {
    setSessionTimeout()
  }
}

// Añadir listeners para eventos de actividad del usuario
onMounted(() => {
  window.addEventListener('click', resetSessionTimer)
  window.addEventListener('keypress', resetSessionTimer)
  window.addEventListener('scroll', resetSessionTimer)
  window.addEventListener('mousemove', resetSessionTimer)
  
  // Si el usuario está autenticado, configurar el temporizador inicialmente
  if (userStore.isAuthenticated) {
    setSessionTimeout()
  }
})

// Limpiar los listeners cuando el componente se desmonta
onBeforeUnmount(() => {
  window.removeEventListener('click', resetSessionTimer)
  window.removeEventListener('keypress', resetSessionTimer)
  window.removeEventListener('scroll', resetSessionTimer)
  window.removeEventListener('mousemove', resetSessionTimer)
  
  if (sessionTimeout) {
    clearTimeout(sessionTimeout)
  }
})

const handleSubmit = async () => {
  error.value = ''
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    })

    if (response.ok) {
      const result = await response.json()
      // Actualizado para incluir el email
      await userStore.login(result.userKey, email.value, result.role)
      
      // Configurar el temporizador de sesión
      setSessionTimeout()

      if (result.temp) {
        return navigateTo('/updatePassword')
      }
      return navigateTo('/panelAdmin')
    } else {
      const errorData = await response.json()
      error.value = errorData.message || 'Error de inicio de sesión'
      console.error('Login failed:', response.status, errorData)
    }
  } catch (error) {
    console.error('Network error during login:', error)
  }
}
</script>

<template>
  <!-- Mantén el mismo template, solo añade el mensaje de error -->
  <v-img class="mx-auto my-6" max-width="58" src="/logo.png" />

  <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg">
    <div class="text-subtitle-1 text-medium-emphasis">Account</div>

    <v-text-field
        v-model="email"
        density="compact"
        placeholder="Email address"
        prepend-inner-icon="mdi-email-outline"
        variant="outlined"
    />

    <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
      Password
      <a class="text-caption text-decoration-none text-blue" href="#">
        Forgot login password?
      </a>
    </div>

    <v-text-field
        v-model="password"
        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
        :type="visible ? 'text' : 'password'"
        density="compact"
        placeholder="Enter your password"
        prepend-inner-icon="mdi-lock-outline"
        variant="outlined"
        @click:append-inner="visible = !visible"
        @keyup.enter="handleSubmit"
    />

    <v-alert v-if="error" type="error" density="compact" class="mb-4">{{ error }}</v-alert>

    <v-btn @click="handleSubmit" class="mb-8" color="blue" size="large" variant="tonal" block>
      Log In
    </v-btn>

    <v-card-text class="text-center">
      <a class="text-blue text-decoration-none" href="#">
        Sign up now
        <v-icon icon="mdi-chevron-right"></v-icon>
      </a>
    </v-card-text>
  </v-card>
</template>
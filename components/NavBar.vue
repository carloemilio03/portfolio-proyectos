<!-- components/Navbar.vue -->
<template>
  <nav class="bg-gray-800 text-white shadow-md">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <!-- Logo y nombre -->
        <div class="flex items-center space-x-2">
          <img src="/logo.png" alt="Logo ANIEI" class="h-12 rounded-sm"/>
          <NuxtLink to="/" class="flex items-center">
            <span class="text-xl font-bold ml-2">ANIEI</span>
          </NuxtLink>
        </div>

        <!-- Navegación principal -->
        <div class="hidden md:flex space-x-4">
          <NuxtLink to="/" class="hover:bg-gray-700 px-3 py-2 rounded transition duration-200 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path
                  d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
            </svg>
            Inicio
          </NuxtLink>
          <NuxtLink to="/register" class="hover:bg-gray-700 px-3 py-2 rounded transition duration-200">
            Registro
          </NuxtLink>
          <NuxtLink to="/escanear" class="hover:bg-gray-700 px-3 py-2 rounded transition duration-200">
            Escanear QR
          </NuxtLink>
          <!-- Mostrar Panel Admin o información de usuario según autenticación -->
          <template v-if="!userStore.isAuthenticated">
            <NuxtLink to="/login" class="hover:bg-gray-700 px-3 py-2 rounded transition duration-200">
              Panel Admin
            </NuxtLink>
          </template>
          <template v-else>
            <div class="relative" ref="userDropdownRef">
              <button
                  @click="toggleUserDropdown"
                  class="flex items-center hover:bg-gray-700 px-3 py-2 rounded transition duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                        clip-rule="evenodd"/>
                </svg>
                {{ userStore.mail }}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clip-rule="evenodd"/>
                </svg>
              </button>
              <div
                  v-if="isUserDropdownOpen"
                  class="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg py-1 z-10"
              >
                <div class="px-4 py-2 text-sm text-gray-200 border-b border-gray-600">
                  <div class="font-medium">{{ userStore.mail }}</div>
                  <div class="text-gray-400">Rol: {{ userStore.role }}</div>
                </div>
                <button
                    @click="()=>{navigateTo('/panelAdmin')}"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-600"
                >
                  Panel
                </button><button
                    @click="handleLogout"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-600"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          </template>
        </div>

        <!-- Menú móvil -->
        <div class="md:hidden">
          <button @click="isOpen = !isOpen"
                  class="focus:outline-none p-2 rounded hover:bg-gray-700 transition duration-200">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                 xmlns="http://www.w3.org/2000/svg">
              <path v-if="!isOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h16"></path>
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Menú móvil desplegable -->
    <div v-if="isOpen" class="md:hidden">
      <div class="bg-gray-700 px-2 py-3 space-y-1">
        <NuxtLink to="/" class="block hover:bg-gray-600 px-3 py-2 rounded transition duration-200 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path
                d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
          </svg>
          Inicio
        </NuxtLink>
        <NuxtLink to="/register" class="block hover:bg-gray-600 px-3 py-2 rounded transition duration-200">
          Registro
        </NuxtLink>
        <NuxtLink to="/escanear" class="block hover:bg-gray-600 px-3 py-2 rounded transition duration-200">
          Escanear QR
        </NuxtLink>

        <!-- Versión móvil del panel admin o info de usuario -->
        <template v-if="!userStore.isAuthenticated">
          <NuxtLink to="/login" class="block hover:bg-gray-600 px-3 py-2 rounded transition duration-200">
            Panel Admin
          </NuxtLink>
        </template>
        <template v-else>
          <div class="px-3 py-2 border-t border-gray-600 mt-2">
            <div class="text-sm mb-2">
              <div class="font-medium">{{ userStore.mail }}</div>
              <div class="text-gray-400 text-xs">Rol: {{ userStore.role }}</div>
            </div>
            <button
                @click="handleLogout"
                class="mt-2 w-full text-left px-2 py-2 text-sm bg-gray-600 hover:bg-gray-500 rounded transition duration-200"
            >
              Cerrar sesión
            </button>
          </div>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import {useUserStore} from '~/stores/userStore';
import {useRouter} from 'vue-router';

const isOpen = ref(false);
const isUserDropdownOpen = ref(false);
const userDropdownRef = ref(null);
const userStore = useUserStore();
const router = useRouter();

// Inicializa el estado del usuario al cargar el componente
onMounted(() => {
  userStore.initialize();

  // Añadir manejador de clic global para cerrar el dropdown cuando se hace clic fuera
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  // Limpiar event listener al desmontar el componente
  document.removeEventListener('click', handleClickOutside);
});

// Maneja los clics fuera del dropdown para cerrarlo
const handleClickOutside = (event) => {
  if (userDropdownRef.value && !userDropdownRef.value.contains(event.target)) {
    isUserDropdownOpen.value = false;
  }
};

// Alterna la visibilidad del dropdown de usuario
const toggleUserDropdown = (event) => {
  event.stopPropagation();
  isUserDropdownOpen.value = !isUserDropdownOpen.value;
};

// Maneja el cierre de sesión
const handleLogout = () => {
  userStore.logout();
  // Redirige al inicio después de cerrar sesión
  router.push('/');
  // Cierra los menús
  isOpen.value = false;
  isUserDropdownOpen.value = false;
};
</script>
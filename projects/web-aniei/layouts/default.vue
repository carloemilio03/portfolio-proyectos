// layouts/default.vue
<template>
  <div class="flex flex-col min-h-screen bg-gray-100 font-sans">
    <NavBar/>

    <main class="flex-grow container mx-auto px-4 py-8">
      <slot/>
    </main>

    <Footer/>
  </div>
</template>

<script setup>
import Footer from '~/components/Footer.vue';
import NavBar from '~/components/NavBar.vue';
</script>

<style>
  html, body, #__nuxt {
    height: 100%;
    font-family: 'Noto Sans', sans-serif;
  }
  
  /* Estilos globales para mejorar la coherencia entre componentes */
  .container {
    max-width: 1280px;
  }
  
  /* Clases de transición para mejorar la experiencia del usuario */
  .transition {
    transition-property: background-color, border-color, color, fill, stroke;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 200ms;
  }
</style>
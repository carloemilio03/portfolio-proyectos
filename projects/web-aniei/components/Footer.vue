﻿<!-- components/Footer.vue -->
<template>
  <footer class="bg-gray-800 text-white shadow-inner">
    <div class="container mx-auto px-4 py-6">
      <div class="flex flex-col md:flex-row justify-between">
        <!-- Información del congreso -->
        <div class="mb-4 md:mb-0">
          <h3 class="text-lg font-semibold mb-2">CongresoApp</h3>
          <p class="text-gray-300">Sistema de registro de asistentes</p>
          <p class="text-gray-300 mt-1">{{ currentYear }} © Todos los derechos reservados</p>
        </div>

        <!-- Enlaces rápidos -->
        <div class="mb-4 md:mb-0">
          <h4 class="text-lg font-semibold mb-2">Enlaces rápidos</h4>
          <ul class="space-y-1">
            <li>
              <NuxtLink to="/" class="text-gray-300 hover:text-white transition duration-200">
                Inicio
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/registro" class="text-gray-300 hover:text-white transition duration-200">
                Registro
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/escanear" class="text-gray-300 hover:text-white transition duration-200">
                Escanear QR
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/login" class="text-gray-300 hover:text-white transition duration-200">
                Panel Administrativo
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Contacto -->
        <div>
          <h4 class="text-lg font-semibold mb-2">Contacto</h4>
          <address class="not-italic text-gray-300">
            <p>Email: contacto@congresoapp.com</p>
            <p>Teléfono: +123 456 7890</p>
          </address>
          <!-- Redes sociales -->
          <div class="flex space-x-4 mt-3">
            <a href="#" class="text-gray-300 hover:text-white transition duration-200">
              <span class="sr-only">Twitter</span>
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178-.004-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
              </svg>
            </a>
            <a href="#" class="text-gray-300 hover:text-white transition duration-200">
              <span class="sr-only">LinkedIn</span>
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue';
const currentYear = computed(() => new Date().getFullYear());
</script>
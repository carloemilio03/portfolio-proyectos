<template>
  <NuxtLayout>
    <div class="admin-controls">
      <div class="mode-selector">
        <button 
          @click="activeMode = 'create'" 
          :class="['mode-button', activeMode === 'create' ? 'active-mode' : '']"
        >
          Crear
        </button>
        <button 
          @click="activeMode = 'edit'" 
          :class="['mode-button', activeMode === 'edit' ? 'active-mode' : '']"
        >
          Editar
        </button>
      </div>
      
      <CreatePanel v-if="activeMode === 'create'" />
      <EditPanel v-else />
    </div>
  </NuxtLayout>
</template>

<script setup>
import {ref} from 'vue'
import CreatePanel from "~/components/CreatePanel.vue";
import EditPanel from "~/components/EditPanel.vue";

const userStore = useUserStore()

const status = ref(userStore.isAuthenticated)
const activeMode = ref('create')

definePageMeta({
  layout: 'default',
});
</script>

<style scoped>
.admin-controls {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.mode-selector {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  padding: 0.5rem;
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
}

.mode-button {
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  margin: 0 0.25rem;
  background-color: #f3f4f6;
  color: #4b5563;
}

.mode-button:hover {
  background-color: #e5e7eb;
}

.mode-button.active-mode {
  background-color: #3b82f6;
  color: white;
}

@media (max-width: 640px) {
  .mode-selector {
    width: 90%;
  }
  
  .mode-button {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
}
</style>
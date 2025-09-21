<template>
  <div class="admin-panel">
    <div class="container">
      <h1 class="page-title">Elige una categoría para crear</h1>

      <!-- Navigation Tabs -->
      <div class="tab-navigation">
        <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="['tab-button', activeTab === tab.id ? 'active-tab' : 'inactive-tab']"
        >
          {{ tab.name }}
        </button>
      </div>

      <!-- Events Tab -->
      <div v-if="activeTab === 'events'" class="tab-content">
        <div class="panel">
          <h2 class="panel-title">Crear Evento</h2>
          <form @submit.prevent="createEvent" class="form-container">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Nombre del Evento</label>
                <input
                    v-model="eventForm.name"
                    type="text"
                    required
                    class="form-input"
                >
              </div>
              <div class="form-group">
                <label class="form-label">Enlace</label>
                <input
                    v-model="eventForm.link"
                    type="url"
                    required
                    class="form-input"
                >
              </div>
              <div class="form-group">
                <label class="form-label">Fecha de Inicio</label>
                <input
                    v-model="eventForm.startDate"
                    type="date"
                    required
                    class="form-input"
                >
              </div>
              <div class="form-group">
                <label class="form-label">Fecha de Fin</label>
                <input
                    v-model="eventForm.endDate"
                    type="date"
                    required
                    class="form-input"
                >
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Lugar</label>
              <input
                  v-model="eventForm.place"
                  type="text"
                  required
                  class="form-input"
              >
            </div>
            <button
                type="submit"
                :disabled="loading"
                class="submit-button event-button"
            >
              {{ loading ? 'Creando...' : 'Crear Evento' }}
            </button>
          </form>
        </div>
      </div>

      <!-- Courses Tab -->
      <div v-if="activeTab === 'courses'" class="tab-content">
        <div class="panel">
          <h2 class="panel-title">Crear Curso</h2>
          <form @submit.prevent="createCourse" class="form-container">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Nombre del Curso</label>
                <input
                    v-model="courseForm.name"
                    type="text"
                    required
                    class="form-input"
                >
              </div>
              <div class="form-group">
                <label class="form-label">Evento</label>
                <div class="relative dropdown-container">
                  <select
                      v-model="courseForm.eventID"
                      required
                      class="form-input"
                      :disabled="noEventosDisponibles"
                  >
                    <option value="" disabled>{{ noEventosDisponibles ? 'No hay eventos disponibles' : 'Selecciona un evento' }}</option>
                    <option v-for="evento in opcionesEventos" 
                            :key="evento.eventID" 
                            :value="evento.eventID.toString()">
                      {{ evento.name }}
                    </option>
                  </select>
                  <div class="dropdown-arrow"></div>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Ponente</label>
                <div class="relative dropdown-container">
                  <select
                      v-model="courseForm.speakerID"
                      required
                      class="form-input"
                      :disabled="noSpeakersDisponibles || isLoading"
                  >
                    <option value="" disabled>{{ isLoading ? 'Cargando ponentes...' : noSpeakersDisponibles ? 'No hay ponentes disponibles' : 'Selecciona un ponente' }}</option>
                    <option v-for="speaker in opcionesSpeakers" 
                            :key="speaker.speakerID" 
                            :value="speaker.speakerID.toString()">
                      {{ speaker.name }}
                    </option>
                  </select>
                  <div v-if="isLoading" class="absolute inset-y-0 right-0 flex items-center pr-8 z-10">
                    <div class="w-4 h-4 border-t-2 border-blue-500 border-r-2 rounded-full animate-spin"></div>
                  </div>
                  <div class="dropdown-arrow" v-if="!isLoading"></div>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Fecha del Curso</label>
                <input
                    v-model="courseForm.courseDate"
                    type="datetime-local"
                    required
                    class="form-input"
                >
              </div>
            </div>
            <button
                type="submit"
                :disabled="loading"
                class="submit-button course-button"
            >
              {{ loading ? 'Creando...' : 'Crear Curso' }}
            </button>
          </form>
        </div>
      </div>

      <!-- Lectures Tab -->
      <div v-if="activeTab === 'lectures'" class="tab-content">
        <div class="panel">
          <h2 class="panel-title">Crear Conferencia</h2>
          <form @submit.prevent="createLecture" class="form-container">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Evento</label>
                <div class="relative dropdown-container">
                  <select
                      v-model="lectureForm.eventID"
                      required
                      class="form-input"
                      :disabled="noEventosDisponibles"
                  >
                    <option value="" disabled>{{ noEventosDisponibles ? 'No hay eventos disponibles' : 'Selecciona un evento' }}</option>
                    <option v-for="evento in opcionesEventos" 
                            :key="evento.eventID" 
                            :value="evento.eventID.toString()">
                      {{ evento.name }}
                    </option>
                  </select>
                  <div class="dropdown-arrow"></div>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Ponente</label>
                <div class="relative dropdown-container">
                  <select
                      v-model="lectureForm.speakerID"
                      required
                      class="form-input"
                      :disabled="noSpeakersDisponibles || isLoading"
                  >
                    <option value="" disabled>{{ isLoading ? 'Cargando ponentes...' : noSpeakersDisponibles ? 'No hay ponentes disponibles' : 'Selecciona un ponente' }}</option>
                    <option v-for="speaker in opcionesSpeakers" 
                            :key="speaker.speakerID" 
                            :value="speaker.speakerID.toString()">
                      {{ speaker.name }}
                    </option>
                  </select>
                  <div v-if="isLoading" class="absolute inset-y-0 right-0 flex items-center pr-8 z-10">
                    <div class="w-4 h-4 border-t-2 border-blue-500 border-r-2 rounded-full animate-spin"></div>
                  </div>
                  <div class="dropdown-arrow" v-if="!isLoading"></div>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Nombre de la Conferencia</label>
                <input
                    v-model="lectureForm.name"
                    type="text"
                    required
                    class="form-input"
                >
              </div>
              <div class="form-group">
                <label class="form-label">Fecha de la Conferencia</label>
                <input
                    v-model="lectureForm.lectureDate"
                    type="datetime-local"
                    required
                    class="form-input"
                >
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Enlace de Pago</label>
              <input
                  v-model="lectureForm.paymentLink"
                  type="url"
                  required
                  class="form-input"
              >
            </div>
            <button
                type="submit"
                :disabled="loading"
                class="submit-button lecture-button"
            >
              {{ loading ? 'Creando...' : 'Crear Conferencia' }}
            </button>
          </form>
        </div>
      </div>

      <!-- Speakers Tab -->
      <div v-if="activeTab === 'speakers'" class="tab-content">
        <div class="panel">
          <h2 class="panel-title">Crear Ponente</h2>
          <form @submit.prevent="createSpeaker" class="form-container">
            <div class="form-grid-three">
              <div class="form-group">
                <label class="form-label">Nombre</label>
                <input
                    v-model="speakerForm.name"
                    type="text"
                    required
                    class="form-input"
                >
              </div>
              <div class="form-group">
                <label class="form-label">Apellido</label>
                <input
                    v-model="speakerForm.lastname"
                    type="text"
                    required
                    class="form-input"
                >
              </div>
              <div class="form-group">
                <label class="form-label">Email</label>
                <input
                    v-model="speakerForm.email"
                    type="email"
                    required
                    class="form-input"
                >
              </div>
            </div>
            <button
                type="submit"
                :disabled="loading"
                class="submit-button speaker-button"
            >
              {{ loading ? 'Creando...' : 'Crear Speaker' }}
            </button>
          </form>
        </div>
      </div>

      <!-- Organizers Tab -->
      <div v-if="activeTab === 'organizers'" class="tab-content">
        <div class="panel">
          <h2 class="panel-title">Registrar Organizador</h2>
          <form @submit.prevent="createOrganizer" class="form-container">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Email del Organizador</label>
                <input
                    v-model="organizerForm.email"
                    type="email"
                    required
                    class="form-input"
                >
              </div>
              <div class="form-group">
                <label class="form-label">Evento</label>
                <div class="relative dropdown-container">
                  <select
                      v-model="organizerForm.eventID"
                      required
                      class="form-input"
                      :disabled="noEventosDisponibles"
                  >
                    <option value="" disabled>{{ noEventosDisponibles ? 'No hay eventos disponibles' : 'Selecciona un evento' }}</option>
                    <option v-for="evento in opcionesEventos" 
                            :key="evento.eventID" 
                            :value="evento.eventID.toString()">
                      {{ evento.name }}
                    </option>
                  </select>
                  <div class="dropdown-arrow"></div>
                </div>
              </div>
            </div>
            <button
                type="submit"
                :disabled="loading"
                class="submit-button organizer-button"
            >
              {{ loading ? 'Registrando...' : 'Registrar Organizador' }}
            </button>
          </form>
        </div>
      </div>

      <!-- Certificates Tab -->
      <div v-if="activeTab === 'certificates'" class="tab-content">
        <div class="panel">
          <h2 class="panel-title">Crear Certificado</h2>
          <form @submit.prevent="createCertificate" class="form-container">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Evento</label>
                <div class="relative dropdown-container">
                  <select
                      v-model="certificateForm.eventID"
                      required
                      class="form-input"
                      :disabled="noEventosDisponibles"
                  >
                    <option value="" disabled>{{ noEventosDisponibles ? 'No hay eventos disponibles' : 'Selecciona un evento' }}</option>
                    <option v-for="evento in opcionesEventos" 
                            :key="evento.eventID" 
                            :value="evento.eventID.toString()">
                      {{ evento.name }}
                    </option>
                  </select>
                  <div class="dropdown-arrow"></div>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Encabezado</label>
                <input
                    v-model="certificateForm.header"
                    type="text"
                    required
                    class="form-input"
                >
              </div>
              <div class="form-group">
                <label class="form-label">Nombre</label>
                <input
                    v-model="certificateForm.name"
                    type="text"
                    required
                    class="form-input"
                >
              </div>
              <div class="form-group">
                <label class="form-label">Fecha</label>
                <input
                    v-model="certificateForm.date"
                    type="text"
                    required
                    placeholder="Formato: Texto|Texto"
                    class="form-input"
                >
              </div>
            </div>
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Lugar</label>
                <input
                    v-model="certificateForm.place"
                    type="text"
                    required
                    class="form-input"
                >
              </div>
              <div class="form-group">
                <label class="form-label">Razón (opcional)</label>
                <input
                    v-model="certificateForm.reason"
                    type="text"
                    class="form-input"
                >
              </div>
            </div>

            <!-- File Uploads -->
            <div class="file-section">
              <h3 class="section-title">Archivos del Certificado</h3>
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Banner</label>
                  <input
                      ref="bannerFile"
                      type="file"
                      accept="image/*"
                      required
                      class="form-file"
                  >
                </div>
                <div class="form-group">
                  <label class="form-label">Firma Izquierda</label>
                  <input
                      ref="signatureLFile"
                      type="file"
                      accept="image/*"
                      required
                      class="form-file"
                  >
                </div>
                <div class="form-group">
                  <label class="form-label">Firma Derecha</label>
                  <input
                      ref="signatureRFile"
                      type="file"
                      accept="image/*"
                      required
                      class="form-file"
                  >
                </div>
                <div class="form-group">
                  <label class="form-label">Logo</label>
                  <input
                      ref="logoFile"
                      type="file"
                      accept="image/*"
                      required
                      class="form-file"
                  >
                </div>
                <div class="full-width">
                  <label class="form-label">Plantilla PDF</label>
                  <input
                      ref="templateFile"
                      type="file"
                      accept=".pdf"
                      required
                      class="form-file"
                  >
                </div>
              </div>
            </div>

            <!-- Descriptions -->
            <div class="form-group">
              <label class="form-label">Descripciones (JSON)</label>
              <textarea
                  v-model="certificateDescriptions"
                  rows="4"
                  required
                  placeholder='{"data": ["Descripción 1", "Descripción 2", "Descripción 3"]}'
                  class="form-textarea"
              ></textarea>
            </div>

            <button
                type="submit"
                :disabled="loading"
                class="submit-button certificate-button"
            >
              {{ loading ? 'Creando...' : 'Crear Certificado' }}
            </button>
          </form>
        </div>
      </div>

      <!-- Success/Error Messages -->
      <div v-if="message" class="message-container">
        <div :class="['message', messageType === 'success' ? 'success-message' : 'error-message']">
          {{ message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';

// Definir el tipo EventItem también aquí o importarlo
interface EventItem {
  eventID: number;
  name: string;
}
const activeTab = ref('events')
const loading = ref(false)
const message = ref('')
const messageType = ref('success')
import { authFetch } from "~/composables/useAuthFetch.js";
import { useAvailableEvents} from "~/composables/useAvailableEvents.js";
import { useAvailableSpeakers} from "~/composables/useAvailableSpeakers.js";
const fetchError = ref('');
const isLoading = ref(false);
const opcionesEventos = ref<EventItem[]>([]);

// Definir interfaz para speakers
interface SpeakerItem {
  speakerID: number;
  name: string;
}

const opcionesSpeakers = ref<SpeakerItem[]>([]);

onMounted(async () => {
  isLoading.value = true;
  
  try {
    // Cargar eventos
    const events = await useAvailableEvents();
    if (events) {
      opcionesEventos.value = events;
    } else {
      fetchError.value = 'No se pudieron cargar los eventos.';
    }
    
    // Cargar speakers
    const speakers = await useAvailableSpeakers();
    if (speakers) {
      opcionesSpeakers.value = speakers;
    } else {
      fetchError.value += ' No se pudieron cargar los ponentes.';
    }
  } catch (error) {
    console.error('Error al cargar datos:', error);
    fetchError.value = 'Error al cargar datos.';
  } finally {
    isLoading.value = false;
  }
});


const tabs = [
  { id: 'events', name: 'Eventos' },
  { id: 'courses', name: 'Cursos' },
  { id: 'lectures', name: 'Conferencias' },
  { id: 'speakers', name: 'Ponentes' },
  { id: 'organizers', name: 'Organizadores' },
  { id: 'certificates', name: 'Certificados' }
]

// Form reactive data
const eventForm = ref({
  name: '',
  link: '',
  startDate: '',
  endDate: '',
  place: ''
})

const courseForm = ref({
  name: '',
  eventID: '',
  speakerID: '',
  courseDate: ''
})

// Variable para mostrar mensaje cuando no hay opciones disponibles
const noEventosDisponibles = computed(() => opcionesEventos.value.length === 0)
const noSpeakersDisponibles = computed(() => opcionesSpeakers.value.length === 0)

const lectureForm = ref({
  eventID: '',
  speakerID: '',
  name: '',
  lectureDate: '',
  paymentLink: ''
})

const speakerForm = ref({
  name: '',
  lastname: '',
  email: ''
})

const organizerForm = ref({
  email: '',
  eventID: ''
})

const certificateForm = ref({
  eventID: '',
  header: '',
  reason: '',
  name: '',
  date: '',
  place: ''
})

const certificateDescriptions = ref('{"data": ["Descripción 1", "Descripción 2", "Descripción 3"]}')

// File refs for certificate
const bannerFile = ref()
const signatureLFile = ref()
const signatureRFile = ref()
const logoFile = ref()
const templateFile = ref()

// API base URL - ajusta según tu configuración
const apiBaseUrl = 'http://localhost:3100/create'

const showMessage = (msg, type = 'success') => {
  message.value = msg
  messageType.value = type
  setTimeout(() => {
    message.value = ''
  }, 5000)
}

const resetForm = (formName) => {
  switch (formName) {
    case 'event':
      eventForm.value = { name: '', link: '', startDate: '', endDate: '', place: '' }
      break
    case 'course':
      courseForm.value = { name: '', eventID: '', speakerID: '', courseDate: '' }
      break
    case 'lecture':
      lectureForm.value = { eventID: '', speakerID: '', name: '', lectureDate: '', paymentLink: '' }
      break
    case 'speaker':
      speakerForm.value = { name: '', lastname: '', email: '' }
      break
    case 'organizer':
      organizerForm.value = { email: '', eventID: '' }
      break
    case 'certificate':
      certificateForm.value = { eventID: '', header: '', reason: '', name: '', date: '', place: '' }
      certificateDescriptions.value = '{"data": ["Descripción 1", "Descripción 2", "Descripción 3"]}'
      break
  }
}

const createEvent = async () => {
  loading.value = true
  try {
    const response = await authFetch(`${apiBaseUrl}/event`, {
      method: 'POST',
      body: eventForm.value
    })
    showMessage('Evento creado exitosamente', 'success')
    resetForm('event')
  } catch (error) {
    showMessage('Error al crear el evento: ' + (error.data?.message || error.message), 'error')

  } finally {
    loading.value = false
  }
}

const createCourse = async () => {
  loading.value = true
  try {
    const response = await authFetch(`${apiBaseUrl}/course`, {
      method: 'POST',
      body: courseForm.value
    })
    showMessage('Curso creado exitosamente', 'success')
    resetForm('course')
  } catch (error) {
    showMessage('Error al crear el curso: ' + (error.data?.message || error.message), 'error')
  } finally {
    loading.value = false
  }
}

const createLecture = async () => {
  loading.value = true
  try {
    const response = await authFetch(`${apiBaseUrl}/lecture`, {
      method: 'POST',
      body: lectureForm.value
    })
    showMessage('Conferencia creada exitosamente', 'success')
    resetForm('lecture')
  } catch (error) {
    showMessage('Error al crear la conferencia: ' + (error.data?.message || error.message), 'error')
  } finally {
    loading.value = false
  }
}

const createSpeaker = async () => {
  loading.value = true
  try {
    const response = await authFetch(`${apiBaseUrl}/speaker`, {
      method: 'POST',
      body: speakerForm.value
    })
    showMessage('Speaker creado exitosamente', 'success')
    resetForm('speaker')
  } catch (error) {
    showMessage('Error al crear el speaker: ' + (error.data?.message || error.message), 'error')
  } finally {
    loading.value = false
  }
}

const createOrganizer = async () => {
  loading.value = true
  try {
    const response = await authFetch(`${apiBaseUrl}/organizer`, {
      method: 'POST',
      body: organizerForm.value
    })
    showMessage('Organizador registrado exitosamente', 'success')
    resetForm('organizer')
  } catch (error) {
    showMessage('Error al registrar el organizador: ' + (error.data?.message || error.message), 'error')
  } finally {
    loading.value = false
  }
}

const createCertificate = async () => {
  loading.value = true
  try {
    const formData = new FormData()

    // Add form fields
    Object.keys(certificateForm.value).forEach(key => {
      formData.append(key, certificateForm.value[key])
    })

    formData.append('descs', certificateDescriptions.value)

    // Add files
    formData.append('files', bannerFile.value.files[0])
    formData.append('files', signatureLFile.value.files[0])
    formData.append('files', signatureRFile.value.files[0])
    formData.append('files', logoFile.value.files[0])
    formData.append('files', templateFile.value.files[0])

    const response = await authFetch(`${apiBaseUrl}/certificate`, {
      method: 'POST',
      body: formData
    })

    showMessage('Certificado creado exitosamente', 'success')
    resetForm('certificate')
  } catch (error) {
    showMessage('Error al crear el certificado: ' + (error.data?.message || error.message), 'error')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.admin-panel {
  min-height: 100vh;
  background-color: #f8fafc;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
}

.page-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 2rem;
  text-align: center;
}

.tab-navigation {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.tab-button {
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  border-radius: 0.5rem 0.5rem 0 0;
  transition: background-color 0.3s, color 0.3s;
  cursor: pointer;
  border: none;
  font-size: 0.875rem;
  font-weight: 500;
}

.active-tab {
  background-color: #3b82f6;
  color: white;
  border-bottom: 2px solid #3b82f6;
}

.inactive-tab {
  background-color: #e5e7eb;
  color: #4b5563;
}

.inactive-tab:hover {
  background-color: #d1d5db;
}

.tab-content {
  animation: fadeIn 0.3s ease-in-out;
}

.panel {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
}

.panel-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.form-grid-three {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.form-group {
  margin-bottom: 0.5rem;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 0.5rem;
}

.form-input,
.form-textarea,
.form-file {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background-color: white;
}

.form-input:focus,
.form-textarea:focus,
.form-file:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}

/* Estilos específicos para selectores */
select.form-input {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background-color: white;
  color: #1f2937;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 20 20' fill='none'%3E%3Cpath d='M7 7l3 3 3-3' stroke='%234B5563' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1em;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  line-height: 1.2;
}

select.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  background-color: white;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}

select.form-input:disabled {
  background-color: #f3f4f6;
  color: #9ca3af;
  cursor: not-allowed;
  border-color: #e5e7eb;
  opacity: 0.7;
  box-shadow: none;
}

select.form-input[disabled] option {
  color: #9ca3af;
}

select.form-input:hover:not(:disabled) {
  background-color: #f9fafb;
  border-color: #9ca3af;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Estilos para las opciones del select */
select.form-input option {
  background-color: white;
  color: #1f2937;
  padding: 0.75rem;
  font-size: 0.875rem;
}

select.form-input option:checked {
  background-color: #dbeafe;
  color: #1e40af;
}

/* Especificidad para navegadores WebKit (Chrome, Safari) */
select.form-input::-webkit-scrollbar {
  width: 8px;
}

select.form-input::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

select.form-input::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

select.form-input::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Modo oscuro */
@media (prefers-color-scheme: dark) {
  select.form-input {
    background-color: #1f2937;
    color: #f3f4f6;
    border-color: #4b5563;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 20 20' fill='none'%3E%3Cpath d='M7 7l3 3 3-3' stroke='%23e5e7eb' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  }
  
  select.form-input:hover:not(:disabled) {
    background-color: #374151;
    border-color: #6b7280;
  }
  
  select.form-input:focus {
    border-color: #60a5fa;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.3);
    background-color: #374151;
  }
  
  select.form-input option {
    background-color: #1f2937;
    color: #e5e7eb;
  }
  
  select.form-input option:checked {
    background-color: #2563eb;
    color: white;
  }
  
  select.form-input:disabled {
    background-color: #374151;
    color: #9ca3af;
    border-color: #4b5563;
  }
}

/* Soporte específico para Firefox */
@-moz-document url-prefix() {
  select.form-input {
    padding-right: 2.5rem;
    text-overflow: ellipsis;
  }
  
  select.form-input option {
    padding: 0.5rem;
  }
}

/* Soporte específico para Safari */
@media not all and (min-resolution:.001dpcm) { 
  @supports (-webkit-appearance:none) {
    select.form-input {
      padding-right: 2.5rem;
      padding-top: 0.6rem;
      padding-bottom: 0.6rem;
    }
  }
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.form-file {
  padding: 0.25rem;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 1rem;
}

.file-section {
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}

.full-width {
  grid-column: 1 / -1;
}

.submit-button {
  padding: 0.5rem 1.5rem;
  border-radius: 0.375rem;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  border: none;
  align-self: flex-start;
}

.submit-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.event-button {
  background-color: #3b82f6;
}

.event-button:hover:not(:disabled) {
  background-color: #2563eb;
}

.course-button {
  background-color: #10b981;
}

.course-button:hover:not(:disabled) {
  background-color: #059669;
}

.lecture-button {
  background-color: #8b5cf6;
}

.lecture-button:hover:not(:disabled) {
  background-color: #7c3aed;
}

.speaker-button {
  background-color: #f59e0b;
}

.speaker-button:hover:not(:disabled) {
  background-color: #d97706;
}

.organizer-button {
  background-color: #6366f1;
}

.organizer-button:hover:not(:disabled) {
  background-color: #4f46e5;
}

.certificate-button {
  background-color: #ef4444;
}

.certificate-button:hover:not(:disabled) {
  background-color: #dc2626;
}

/* Estilos para contenedores de dropdown */
.dropdown-container {
  position: relative;
  width: 100%;
}

.dropdown-arrow {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 2.5rem;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dropdown-arrow::after {
  content: '';
  width: 0.8rem;
  height: 0.8rem;
  border-right: 2px solid #6b7280;
  border-bottom: 2px solid #6b7280;
  transform: rotate(45deg) translateY(-25%);
  transition: transform 0.2s ease;
}

select.form-input:focus + .dropdown-arrow::after {
  border-color: #3b82f6;
}

.message-container {
  margin-top: 1.5rem;
}

.message {
  padding: 1rem;
  border-radius: 0.375rem;
}

.success-message {
  background-color: #d1fae5;
  color: #047857;
}

.error-message {
  background-color: #fee2e2;
  color: #b91c1c;
}

/* Mejora para visualización en dispositivos móviles */
@media (max-width: 640px) {
  select.form-input {
    font-size: 1rem;
    padding: 0.75rem 3rem 0.75rem 1rem;
  }
  
  .dropdown-arrow {
    width: 3rem;
  }
  
  .dropdown-arrow::after {
    width: 0.9rem;
    height: 0.9rem;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Ajustes específicos para navegadores */
@-moz-document url-prefix() {
  select.form-input {
    background-color: #edf2f7;
    color: #1f2937;
    text-indent: 0.01px;
    text-overflow: '';
  }
}

/* Para Safari y Chrome */
@media screen and (-webkit-min-device-pixel-ratio:0) {
  select.form-input {
    background-color: #edf2f7;
    -webkit-appearance: none;
  }
}

/* Media queries for responsiveness */
@media (min-width: 768px) {
  .form-grid, 
  .form-grid-three {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .form-grid-three {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .page-title {
    font-size: 2.25rem;
  }
}
</style>
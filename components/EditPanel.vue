<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';

// Importar composables
import { authFetch } from "~/composables/useAuthFetch.js";
import { 
  useEditableEvents, 
  useEditableCourses, 
  useEditableSpeakers, 
  useEditableLectures, 
  useEditableAttendees,
  updateEvent,
  updateCourse,
  updateSpeaker,
  updateLecture,
  updateAttendee,
  type EditableEvent,
  type EditableCourse,
  type EditableSpeaker,
  type EditableLecture,
  type EditableAttendee
} from "~/composables/useEditableItems";

// Estado activo de las pestañas
const activeTab = ref('events');
const loading = ref(false);
const message = ref('');
const messageType = ref('success');

// Datos disponibles para seleccionar
const availableEvents = ref<EditableEvent[]>([]);
const availableSpeakers = ref<EditableSpeaker[]>([]);

// Elemento seleccionado para editar
const selectedEventId = ref('');
const selectedCourseId = ref('');
const selectedSpeakerId = ref('');
const selectedLectureId = ref('');
const selectedAttendeeId = ref('');

// Datos cargados para editar
const events = ref<EditableEvent[]>([]);
const courses = ref<EditableCourse[]>([]);
const speakers = ref<EditableSpeaker[]>([]);
const lectures = ref<EditableLecture[]>([]);
const attendees = ref<EditableAttendee[]>([]);

// Formularios para editar
const eventForm = ref<EditableEvent>({
  eventID: 0,
  name: '',
  link: '',
  startDate: '',
  endDate: '',
  place: ''
});

const courseForm = ref<EditableCourse>({
  courseID: 0,
  name: '',
  eventID: 0,
  speakerID: 0,
  courseDate: ''
});

const speakerForm = ref<EditableSpeaker>({
  speakerID: 0,
  name: '',
  lastname: '',
  email: ''
});

const lectureForm = ref<EditableLecture>({
  lectureID: 0,
  eventID: 0,
  speakerID: 0,
  name: '',
  lectureDate: '',
  paymentLink: ''
});

const attendeeForm = ref<EditableAttendee>({
  attendeeID: 0,
  name: '',
  lastname: '',
  email: '',
  paymentLink: ''
});

// Variables para estado de carga
const isLoading = ref({
  events: false,
  courses: false,
  speakers: false,
  lectures: false,
  attendees: false
});

// Verificadores de disponibilidad
const noEventosDisponibles = computed(() => availableEvents.value.length === 0);
const noSpeakersDisponibles = computed(() => availableSpeakers.value.length === 0);

// Definición de pestañas
const tabs = [
  { id: 'events', name: 'Eventos' },
  { id: 'courses', name: 'Cursos' },
  { id: 'lectures', name: 'Conferencias' },
  { id: 'speakers', name: 'Ponentes' },
  { id: 'attendees', name: 'Asistentes' }
];

// Carga inicial de datos
onMounted(async () => {
  await loadInitialData();
});

// Cargar datos iniciales
async function loadInitialData() {
  try {
    isLoading.value.events = true;
    isLoading.value.speakers = true;
    
    // Cargar eventos y ponentes para los selectores
    const eventsData = await useEditableEvents();
    availableEvents.value = eventsData;
    events.value = eventsData;
    
    const speakersData = await useEditableSpeakers();
    availableSpeakers.value = speakersData;
    speakers.value = speakersData;
  } catch (error) {
    console.error('Error al cargar datos iniciales:', error);
    showMessage('Error al cargar datos iniciales', 'error');
  } finally {
    isLoading.value.events = false;
    isLoading.value.speakers = false;
  }
}

// Cargar cursos cuando se selecciona un evento
watch(selectedEventId, async (newValue) => {
  if (newValue && activeTab.value === 'courses') {
    await loadCourses(newValue);
  } else if (newValue && activeTab.value === 'lectures') {
    await loadLectures(newValue);
  } else if (newValue && activeTab.value === 'attendees') {
    await loadAttendees(newValue);
  }
});

// Funciones para cargar datos específicos
async function loadCourses(eventId: string) {
  if (!eventId) return;
  isLoading.value.courses = true;
  try {
    const coursesData = await useEditableCourses(eventId);
    courses.value = coursesData;
  } catch (error) {
    console.error('Error al cargar cursos:', error);
    showMessage('Error al cargar cursos', 'error');
  } finally {
    isLoading.value.courses = false;
  }
}

async function loadLectures(eventId: string) {
  if (!eventId) return;
  isLoading.value.lectures = true;
  try {
    const lecturesData = await useEditableLectures(eventId);
    lectures.value = lecturesData;
  } catch (error) {
    console.error('Error al cargar conferencias:', error);
    showMessage('Error al cargar conferencias', 'error');
  } finally {
    isLoading.value.lectures = false;
  }
}

async function loadAttendees(eventId: string) {
  if (!eventId) return;
  isLoading.value.attendees = true;
  try {
    const attendeesData = await useEditableAttendees(eventId);
    attendees.value = attendeesData;
  } catch (error) {
    console.error('Error al cargar asistentes:', error);
    showMessage('Error al cargar asistentes', 'error');
  } finally {
    isLoading.value.attendees = false;
  }
}

// Cargar datos cuando se cambia de pestaña
watch(activeTab, async (newTab) => {
  if (newTab === 'events') {
    await loadInitialData();
  } else if (newTab === 'courses' && selectedEventId.value) {
    await loadCourses(selectedEventId.value);
  } else if (newTab === 'lectures' && selectedEventId.value) {
    await loadLectures(selectedEventId.value);
  } else if (newTab === 'attendees' && selectedEventId.value) {
    await loadAttendees(selectedEventId.value);
  } else if (newTab === 'speakers') {
    isLoading.value.speakers = true;
    try {
      const speakersData = await useEditableSpeakers();
      speakers.value = speakersData;
    } catch (error) {
      console.error('Error al cargar ponentes:', error);
      showMessage('Error al cargar ponentes', 'error');
    } finally {
      isLoading.value.speakers = false;
    }
  }
});

// Función para seleccionar un elemento y cargar sus datos en el formulario
function selectEvent(event: EditableEvent) {
  eventForm.value = { ...event };
  // Convertir fechas al formato del input date
  if (eventForm.value.startDate) {
    eventForm.value.startDate = eventForm.value.startDate.split('T')[0];
  }
  if (eventForm.value.endDate) {
    eventForm.value.endDate = eventForm.value.endDate.split('T')[0];
  }
}

function selectCourse(course: EditableCourse) {
  courseForm.value = { ...course };
  // Formatear fecha para input datetime-local
  if (courseForm.value.courseDate) {
    courseForm.value.courseDate = formatDatetimeLocal(courseForm.value.courseDate);
  }
}

function selectSpeaker(speaker: EditableSpeaker) {
  speakerForm.value = { ...speaker };
}

function selectLecture(lecture: EditableLecture) {
  lectureForm.value = { ...lecture };
  // Formatear fecha para input datetime-local
  if (lectureForm.value.lectureDate) {
    lectureForm.value.lectureDate = formatDatetimeLocal(lectureForm.value.lectureDate);
  }
}

function selectAttendee(attendee: EditableAttendee) {
  attendeeForm.value = { ...attendee };
}

// Función para formatear fecha a formato datetime-local
function formatDatetimeLocal(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().slice(0, 16); // Formato YYYY-MM-DDThh:mm
}

// Funciones para actualizar elementos
async function saveEvent() {
  loading.value = true;
  try {
    const success = await updateEvent(eventForm.value);
    if (success) {
      showMessage('Evento actualizado exitosamente', 'success');
      // Recargar eventos
      await loadInitialData();
    } else {
      showMessage('Error al actualizar el evento', 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    showMessage('Error al actualizar el evento', 'error');
  } finally {
    loading.value = false;
  }
}

async function saveCourse() {
  loading.value = true;
  try {
    const success = await updateCourse(courseForm.value);
    if (success) {
      showMessage('Curso actualizado exitosamente', 'success');
      // Recargar cursos
      if (selectedEventId.value) {
        await loadCourses(selectedEventId.value);
      }
    } else {
      showMessage('Error al actualizar el curso', 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    showMessage('Error al actualizar el curso', 'error');
  } finally {
    loading.value = false;
  }
}

async function saveSpeaker() {
  loading.value = true;
  try {
    const success = await updateSpeaker(speakerForm.value);
    if (success) {
      showMessage('Ponente actualizado exitosamente', 'success');
      // Recargar ponentes
      const speakersData = await useEditableSpeakers();
      speakers.value = speakersData;
      availableSpeakers.value = speakersData;
    } else {
      showMessage('Error al actualizar el ponente', 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    showMessage('Error al actualizar el ponente', 'error');
  } finally {
    loading.value = false;
  }
}

async function saveLecture() {
  loading.value = true;
  try {
    const success = await updateLecture(lectureForm.value);
    if (success) {
      showMessage('Conferencia actualizada exitosamente', 'success');
      // Recargar conferencias
      if (selectedEventId.value) {
        await loadLectures(selectedEventId.value);
      }
    } else {
      showMessage('Error al actualizar la conferencia', 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    showMessage('Error al actualizar la conferencia', 'error');
  } finally {
    loading.value = false;
  }
}

async function saveAttendee() {
  loading.value = true;
  try {
    const success = await updateAttendee(attendeeForm.value);
    if (success) {
      showMessage('Asistente actualizado exitosamente', 'success');
      // Recargar asistentes
      if (selectedEventId.value) {
        await loadAttendees(selectedEventId.value);
      }
    } else {
      showMessage('Error al actualizar el asistente', 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    showMessage('Error al actualizar el asistente', 'error');
  } finally {
    loading.value = false;
  }
}

// Función para mostrar mensajes
function showMessage(msg: string, type = 'success') {
  message.value = msg;
  messageType.value = type;
  setTimeout(() => {
    message.value = '';
  }, 5000);
}
</script>

<template>
  <div class="admin-panel">
    <div class="container">
      <h1 class="page-title">Panel de Edición</h1>

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
          <h2 class="panel-title">Editar Evento</h2>
          
          <!-- Lista de eventos disponibles -->
          <div class="items-list">
            <div v-if="isLoading.events" class="loading-indicator">Cargando eventos...</div>
            <div v-else-if="events.length === 0" class="empty-list">No hay eventos disponibles</div>
            <div v-else class="list-container">
              <div 
                v-for="event in events" 
                :key="event.eventID" 
                @click="selectEvent(event)"
                class="list-item"
                :class="{ 'selected-item': eventForm.eventID === event.eventID }"
              >
                {{ event.name }}
              </div>
            </div>
          </div>
          
          <!-- Formulario de edición -->
          <form v-if="eventForm.eventID" @submit.prevent="saveEvent" class="form-container">
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
              {{ loading ? 'Guardando...' : 'Guardar Cambios' }}
            </button>
          </form>
        </div>
      </div>

      <!-- Courses Tab -->
      <div v-if="activeTab === 'courses'" class="tab-content">
        <div class="panel">
          <h2 class="panel-title">Editar Curso</h2>
          
          <!-- Selector de evento -->
          <div class="form-group">
            <label class="form-label">Selecciona un Evento</label>
            <div class="relative dropdown-container">
              <select
                v-model="selectedEventId"
                class="form-input"
                :disabled="noEventosDisponibles"
              >
                <option value="" disabled>{{ noEventosDisponibles ? 'No hay eventos disponibles' : 'Selecciona un evento' }}</option>
                <option v-for="event in availableEvents" 
                      :key="event.eventID" 
                      :value="event.eventID.toString()">
                  {{ event.name }}
                </option>
              </select>
              <div class="dropdown-arrow"></div>
            </div>
          </div>
          
          <!-- Lista de cursos disponibles -->
          <div class="items-list">
            <div v-if="isLoading.courses" class="loading-indicator">Cargando cursos...</div>
            <div v-else-if="!selectedEventId" class="empty-list">Selecciona un evento para ver los cursos</div>
            <div v-else-if="courses.length === 0" class="empty-list">No hay cursos disponibles para este evento</div>
            <div v-else class="list-container">
              <div 
                v-for="course in courses" 
                :key="course.courseID" 
                @click="selectCourse(course)"
                class="list-item"
                :class="{ 'selected-item': courseForm.courseID === course.courseID }"
              >
                {{ course.name }}
              </div>
            </div>
          </div>
          
          <!-- Formulario de edición -->
          <form v-if="courseForm.courseID" @submit.prevent="saveCourse" class="form-container">
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
                <label class="form-label">Ponente</label>
                <div class="relative dropdown-container">
                  <select
                    v-model="courseForm.speakerID"
                    required
                    class="form-input"
                    :disabled="noSpeakersDisponibles"
                  >
                    <option value="" disabled>{{ noSpeakersDisponibles ? 'No hay ponentes disponibles' : 'Selecciona un ponente' }}</option>
                    <option v-for="speaker in availableSpeakers" 
                          :key="speaker.speakerID" 
                          :value="speaker.speakerID">
                      {{ speaker.name }} {{ speaker.lastname }}
                    </option>
                  </select>
                  <div class="dropdown-arrow"></div>
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
              {{ loading ? 'Guardando...' : 'Guardar Cambios' }}
            </button>
          </form>
        </div>
      </div>

      <!-- Lectures Tab -->
      <div v-if="activeTab === 'lectures'" class="tab-content">
        <div class="panel">
          <h2 class="panel-title">Editar Conferencia</h2>
          
          <!-- Selector de evento -->
          <div class="form-group">
            <label class="form-label">Selecciona un Evento</label>
            <div class="relative dropdown-container">
              <select
                v-model="selectedEventId"
                class="form-input"
                :disabled="noEventosDisponibles"
              >
                <option value="" disabled>{{ noEventosDisponibles ? 'No hay eventos disponibles' : 'Selecciona un evento' }}</option>
                <option v-for="event in availableEvents" 
                      :key="event.eventID" 
                      :value="event.eventID.toString()">
                  {{ event.name }}
                </option>
              </select>
              <div class="dropdown-arrow"></div>
            </div>
          </div>
          
          <!-- Lista de conferencias disponibles -->
          <div class="items-list">
            <div v-if="isLoading.lectures" class="loading-indicator">Cargando conferencias...</div>
            <div v-else-if="!selectedEventId" class="empty-list">Selecciona un evento para ver las conferencias</div>
            <div v-else-if="lectures.length === 0" class="empty-list">No hay conferencias disponibles para este evento</div>
            <div v-else class="list-container">
              <div 
                v-for="lecture in lectures" 
                :key="lecture.lectureID" 
                @click="selectLecture(lecture)"
                class="list-item"
                :class="{ 'selected-item': lectureForm.lectureID === lecture.lectureID }"
              >
                {{ lecture.name }}
              </div>
            </div>
          </div>
          
          <!-- Formulario de edición -->
          <form v-if="lectureForm.lectureID" @submit.prevent="saveLecture" class="form-container">
            <div class="form-grid">
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
                <label class="form-label">Ponente</label>
                <div class="relative dropdown-container">
                  <select
                    v-model="lectureForm.speakerID"
                    required
                    class="form-input"
                    :disabled="noSpeakersDisponibles"
                  >
                    <option value="" disabled>{{ noSpeakersDisponibles ? 'No hay ponentes disponibles' : 'Selecciona un ponente' }}</option>
                    <option v-for="speaker in availableSpeakers" 
                          :key="speaker.speakerID" 
                          :value="speaker.speakerID">
                      {{ speaker.name }} {{ speaker.lastname }}
                    </option>
                  </select>
                  <div class="dropdown-arrow"></div>
                </div>
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
              <div class="form-group">
                <label class="form-label">Enlace de Pago</label>
                <input
                  v-model="lectureForm.paymentLink"
                  type="url"
                  required
                  class="form-input"
                >
              </div>
            </div>
            <button
              type="submit"
              :disabled="loading"
              class="submit-button lecture-button"
            >
              {{ loading ? 'Guardando...' : 'Guardar Cambios' }}
            </button>
          </form>
        </div>
      </div>

      <!-- Speakers Tab -->
      <div v-if="activeTab === 'speakers'" class="tab-content">
        <div class="panel">
          <h2 class="panel-title">Editar Ponente</h2>
          
          <!-- Lista de ponentes disponibles -->
          <div class="items-list">
            <div v-if="isLoading.speakers" class="loading-indicator">Cargando ponentes...</div>
            <div v-else-if="speakers.length === 0" class="empty-list">No hay ponentes disponibles</div>
            <div v-else class="list-container">
              <div 
                v-for="speaker in speakers" 
                :key="speaker.speakerID" 
                @click="selectSpeaker(speaker)"
                class="list-item"
                :class="{ 'selected-item': speakerForm.speakerID === speaker.speakerID }"
              >
                {{ speaker.name }} {{ speaker.lastname }}
              </div>
            </div>
          </div>
          
          <!-- Formulario de edición -->
          <form v-if="speakerForm.speakerID" @submit.prevent="saveSpeaker" class="form-container">
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
              {{ loading ? 'Guardando...' : 'Guardar Cambios' }}
            </button>
          </form>
        </div>
      </div>

      <!-- Attendees Tab -->
      <div v-if="activeTab === 'attendees'" class="tab-content">
        <div class="panel">
          <h2 class="panel-title">Editar Asistente</h2>
          
          <!-- Selector de evento -->
          <div class="form-group">
            <label class="form-label">Selecciona un Evento</label>
            <div class="relative dropdown-container">
              <select
                v-model="selectedEventId"
                class="form-input"
                :disabled="noEventosDisponibles"
              >
                <option value="" disabled>{{ noEventosDisponibles ? 'No hay eventos disponibles' : 'Selecciona un evento' }}</option>
                <option v-for="event in availableEvents" 
                      :key="event.eventID" 
                      :value="event.eventID.toString()">
                  {{ event.name }}
                </option>
              </select>
              <div class="dropdown-arrow"></div>
            </div>
          </div>
          
          <!-- Lista de asistentes disponibles -->
          <div class="items-list">
            <div v-if="isLoading.attendees" class="loading-indicator">Cargando asistentes...</div>
            <div v-else-if="!selectedEventId" class="empty-list">Selecciona un evento para ver los asistentes</div>
            <div v-else-if="attendees.length === 0" class="empty-list">No hay asistentes disponibles para este evento</div>
            <div v-else class="list-container">
              <div 
                v-for="attendee in attendees" 
                :key="attendee.attendeeID" 
                @click="selectAttendee(attendee)"
                class="list-item"
                :class="{ 'selected-item': attendeeForm.attendeeID === attendee.attendeeID }"
              >
                {{ attendee.name }} {{ attendee.lastname }}
              </div>
            </div>
          </div>
          
          <!-- Formulario de edición -->
          <form v-if="attendeeForm.attendeeID" @submit.prevent="saveAttendee" class="form-container">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Nombre</label>
                <input
                  v-model="attendeeForm.name"
                  type="text"
                  required
                  class="form-input"
                >
              </div>
              <div class="form-group">
                <label class="form-label">Apellido</label>
                <input
                  v-model="attendeeForm.lastname"
                  type="text"
                  required
                  class="form-input"
                >
              </div>
              <div class="form-group">
                <label class="form-label">Email</label>
                <input
                  v-model="attendeeForm.email"
                  type="email"
                  required
                  class="form-input"
                >
              </div>
              <div class="form-group">
                <label class="form-label">Enlace de Pago</label>
                <input
                  v-model="attendeeForm.paymentLink"
                  type="url"
                  required
                  class="form-input"
                >
              </div>
            </div>
            <button
              type="submit"
              :disabled="loading"
              class="submit-button attendee-button"
            >
              {{ loading ? 'Guardando...' : 'Guardar Cambios' }}
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

/* Estilos para lista de elementos */
.items-list {
  margin-bottom: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  max-height: 200px;
  overflow-y: auto;
}

.list-container {
  display: flex;
  flex-direction: column;
}

.list-item {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  cursor: pointer;
  transition: background-color 0.2s;
}

.list-item:last-child {
  border-bottom: none;
}

.list-item:hover {
  background-color: #f3f4f6;
}

.selected-item {
  background-color: #dbeafe;
  color: #1e40af;
  font-weight: 500;
}

.loading-indicator, .empty-list {
  padding: 1rem;
  text-align: center;
  color: #6b7280;
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

.form-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background-color: white;
}

.form-input:focus {
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

.attendee-button {
  background-color: #ec4899;
}

.attendee-button:hover:not(:disabled) {
  background-color: #db2777;
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
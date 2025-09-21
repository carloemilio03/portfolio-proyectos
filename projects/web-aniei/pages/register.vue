<script setup lang="ts">
import { ref, onMounted, computed, reactive } from 'vue';
import { useRouter } from 'vue-router';

definePageMeta({
  layout: 'default',
});

const router = useRouter();

// Tab management
const activeTab = ref('individual');
const tabs = [
  { id: 'individual', name: 'Registro Individual' },
  { id: 'group', name: 'Registro Grupal (Profesores)' },
  { id: 'nonacademics', name: 'Registro Individual (No Academicos)' }
];

// Form states
const loading = ref(false);
const message = ref('');
const messageType = ref('success');
const events = ref([]);
const courses = ref([]);
const selectedCourses = ref([]);
const selectedEvent = ref('');
const loadingEvents = ref(true);
const loadingCourses = ref(false);

// Individual registration form
const individualForm = reactive({
  name: '',
  lastname: '',
  email: '',
  eventID: '',
  courses: []
});

// Teacher form for group registration
const teacherForm = reactive({
  name: '',
  lastname: '',
  email: '',
  eventID: '',
  courses: []
});

// Non-academics registration form
const nonacademicsForm = reactive({
  name: '',
  lastname: '',
  email: '',
  company: '',
  position: '',
  eventID: '',
  courses: []
});

// Students form for group registration
const students = ref([
  {
    name: '',
    lastname: '',
    email: '',
    courses: []
  }
]);

// Fetch events
async function fetchEvents() {
  loadingEvents.value = true;
  try {
    const response = await fetch('http://localhost:3100/content/');
    if (!response.ok) throw new Error('Error al cargar eventos');
    const data = await response.json();
    events.value = data.message || [];
  } catch (error) {
    console.error('Error fetching events:', error);
    // Datos de ejemplo para desarrollo
    events.value = [
      { eventID: 1, name: 'Congreso Nacional de Informática 2025' },
      { eventID: 2, name: 'Simposio de Tecnologías Emergentes' },
      { eventID: 3, name: 'Encuentro de Desarrolladores Web' }
    ];
  } finally {
    loadingEvents.value = false;
  }
}

// Fetch courses for a specific event
async function fetchCourses(eventId) {
  if (!eventId) {
    courses.value = [];
    return;
  }

  loadingCourses.value = true;
  try {
    const response = await fetch(`http://localhost:3100/content/courses`, {
      headers: {
        'eventid': eventId.toString()
      }
    });
    if (!response.ok) throw new Error('Error al cargar cursos');
    const data = await response.json();
    courses.value = data.message || [];
  } catch (error) {
    console.error('Error fetching courses:', error);
    // Datos de ejemplo para desarrollo
    courses.value = [
      { courseID: 1, name: 'Introducción a la Inteligencia Artificial' },
      { courseID: 2, name: 'Desarrollo Web Avanzado' },
      { courseID: 3, name: 'Ciberseguridad para Profesionales' },
      { courseID: 4, name: 'Big Data y Análisis Predictivo' }
    ];
  } finally {
    loadingCourses.value = false;
  }
}

// Handle event selection
function handleEventChange(eventId) {
  individualForm.eventID = eventId;
  teacherForm.eventID = eventId;
  nonacademicsForm.eventID = eventId;
  individualForm.courses = [];
  teacherForm.courses = [];
  nonacademicsForm.courses = [];
  students.value.forEach(student => {
    student.courses = [];
  });
  selectedCourses.value = [];
  fetchCourses(eventId);
}

// Toggle course selection for individual registration
function toggleCourseSelection(courseId) {
  const index = selectedCourses.value.indexOf(courseId);
  if (index === -1) {
    selectedCourses.value.push(courseId);
  } else {
    selectedCourses.value.splice(index, 1);
  }

  // Update form courses as space-separated string or array
  individualForm.courses = selectedCourses.value.length > 0 ? selectedCourses.value.join(' ') : '';
  teacherForm.courses = selectedCourses.value.length > 0 ? selectedCourses.value.join(' ') : '';
}

// Toggle course selection for a student
function toggleStudentCourse(studentIndex, courseId) {
  const student = students.value[studentIndex];
  if (!student.courses) {
    student.courses = [];
  }

  const courseIdStr = courseId.toString();
  const coursesArray = Array.isArray(student.courses)
      ? student.courses
      : student.courses.split(' ').filter(Boolean);

  const index = coursesArray.indexOf(courseIdStr);
  if (index === -1) {
    coursesArray.push(courseIdStr);
  } else {
    coursesArray.splice(index, 1);
  }

  // Update student courses as array for UI, will convert to string on submit
  student.courses = coursesArray;
}

// Check if a course is selected for a student
function isStudentCourseSelected(studentIndex, courseId) {
  const student = students.value[studentIndex];
  if (!student.courses) return false;

  const coursesArray = Array.isArray(student.courses)
      ? student.courses
      : student.courses.split(' ').filter(Boolean);

  return coursesArray.includes(courseId.toString());
}

// Add a new student
function addStudent() {
  students.value.push({
    name: '',
    lastname: '',
    email: '',
    courses: []
  });
}

// Remove a student
function removeStudent(index) {
  if (students.value.length > 1) {
    students.value.splice(index, 1);
  }
}

// Display message
function showMessage(msg, type = 'success') {
  message.value = msg;
  messageType.value = type;
  setTimeout(() => {
    message.value = '';
  }, 5000);
}

// Reset form
function resetForm() {
  if (activeTab.value === 'individual') {
    individualForm.name = '';
    individualForm.lastname = '';
    individualForm.email = '';
    individualForm.courses = [];
  } else if (activeTab.value === 'group') {
    teacherForm.name = '';
    teacherForm.lastname = '';
    teacherForm.email = '';
    teacherForm.courses = [];
    students.value = [{
      name: '',
      lastname: '',
      email: '',
      courses: []
    }];
  } else if (activeTab.value === 'nonacademics') {
    nonacademicsForm.name = '';
    nonacademicsForm.lastname = '';
    nonacademicsForm.email = '';
    nonacademicsForm.company = '';
    nonacademicsForm.position = '';
    nonacademicsForm.courses = [];
  }
  selectedCourses.value = [];
}

// Submit individual registration
async function submitIndividualRegistration() {
  if (!individualForm.eventID) {
    showMessage('Por favor, selecciona un evento', 'error');
    return;
  }

  loading.value = true;
  try {
    // Preparar datos para enviar al servidor
    const postData = {
      eventID: individualForm.eventID,
      name: individualForm.name,
      lastname: individualForm.lastname,
      email: individualForm.email
    };

    // Solo incluir courses si hay cursos seleccionados
    if (selectedCourses.value.length > 0) {
      postData.courses = selectedCourses.value.join(' ');
    }

    const response = await fetch('http://localhost:3100/register/attendee', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error en el registro');
    }

    showMessage('¡Registro exitoso! Tu solicitud ha sido recibida.', 'success');
    resetForm();
  } catch (error) {
    console.error('Error during registration:', error);
    showMessage(`Error: ${error.message || 'Hubo un problema al procesar tu registro'}`, 'error');
  } finally {
    loading.value = false;
  }
}

// Submit group registration
async function submitGroupRegistration() {
  if (!teacherForm.eventID) {
    showMessage('Por favor, selecciona un evento', 'error');
    return;
  }

  // Validate that at least one student exists
  if (students.value.length === 0) {
    showMessage('Debes agregar al menos un estudiante', 'error');
    return;
  }

  // Check if all required fields are filled
  let isValid = true;
  let errorMessage = '';

  if (!teacherForm.name || !teacherForm.lastname || !teacherForm.email) {
    isValid = false;
    errorMessage = 'Por favor, completa todos los campos del profesor';
  }

  for (let i = 0; i < students.value.length; i++) {
    const student = students.value[i];
    if (!student.name || !student.lastname || !student.email) {
      isValid = false;
      errorMessage = `Por favor, completa todos los campos del estudiante ${i + 1}`;
      break;
    }
  }

  if (!isValid) {
    showMessage(errorMessage, 'error');
    return;
  }

  // Prepare data for API
  // Convert courses arrays to space-separated strings for each student
  const studentsData = students.value.map(student => ({
    ...student,
    courses: Array.isArray(student.courses) ? student.courses.join(' ') : student.courses
  }));

  // Prepare teacher data
  const teacherData = [{
    eventID: teacherForm.eventID,
    name: teacherForm.name,
    lastname: teacherForm.lastname,
    email: teacherForm.email,
    courses: teacherForm.courses
  }];

  loading.value = true;
  try {
    const response = await fetch('http://localhost:3100/register/teacher', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        teacher: JSON.stringify({ data: teacherData }),
        students: JSON.stringify({ data: studentsData })
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error en el registro grupal');
    }

    showMessage('¡Registro grupal exitoso! Tu solicitud ha sido recibida.', 'success');
    resetForm();
  } catch (error) {
    console.error('Error during group registration:', error);
    showMessage(`Error: ${error.message || 'Hubo un problema al procesar tu registro grupal'}`, 'error');
  } finally {
    loading.value = false;
  }
}

// Submit non-academics registration
async function submitNonacademicsRegistration() {
  if (!nonacademicsForm.eventID) {
    showMessage('Por favor, selecciona un evento', 'error');
    return;
  }

  loading.value = true;
  try {
    // Preparar datos para enviar al servidor
    const postData = {
      eventID: nonacademicsForm.eventID,
      name: nonacademicsForm.name,
      lastname: nonacademicsForm.lastname,
      email: nonacademicsForm.email,
      company: nonacademicsForm.company,
      position: nonacademicsForm.position,
      isNonAcademic: true
    };

    // Solo incluir courses si hay cursos seleccionados
    if (selectedCourses.value.length > 0) {
      postData.courses = selectedCourses.value.join(' ');
    }

    const response = await fetch('http://localhost:3100/register/attendee', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error en el registro');
    }

    showMessage('¡Registro exitoso! Tu solicitud ha sido recibida.', 'success');
    resetForm();
  } catch (error) {
    console.error('Error during registration:', error);
    showMessage(`Error: ${error.message || 'Hubo un problema al procesar tu registro'}`, 'error');
  } finally {
    loading.value = false;
  }
}

// Initialize
onMounted(() => {
  fetchEvents();
});
</script>

<template>
  <NuxtLayout>
    <div class="register-page">
      <div class="container mx-auto px-4 py-8">
        <!-- Hero Section -->
        <section class="bg-gray-800 text-white py-12 rounded-lg mb-8">
          <div class="text-center px-4">
            <h1 class="text-3xl md:text-4xl font-bold mb-4">Registro a Eventos y Cursos</h1>
            <p class="text-lg md:text-xl max-w-3xl mx-auto">
              Completa el formulario para registrarte en los próximos eventos y cursos disponibles
            </p>
          </div>
        </section>

        <!-- Tab Navigation -->
        <div class="tab-navigation mb-6">
          <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="['tab-button', activeTab === tab.id ? 'active-tab' : 'inactive-tab']"
          >
            {{ tab.name }}
          </button>
        </div>

        <!-- Event Selection -->
        <div class="panel mb-8">
          <h2 class="panel-title">Selecciona un Evento</h2>

          <div v-if="loadingEvents" class="flex justify-center py-6">
            <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
          </div>

          <div v-else-if="events.length === 0" class="text-center py-6">
            <p class="text-gray-500">No hay eventos disponibles actualmente.</p>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            <div
                v-for="event in events"
                :key="event.eventID"
                class="bg-white border rounded-lg overflow-hidden transition-all hover:shadow-md cursor-pointer"
                :class="{ 'ring-2 ring-gray-800': selectedEvent === event.eventID }"
                @click="selectedEvent = event.eventID; handleEventChange(event.eventID)"
            >
              <div class="p-4">
                <h3 class="font-semibold text-lg text-gray-800">{{ event.name }}</h3>
                <div v-if="event.startDate && event.endDate" class="text-sm text-gray-600 mt-2">
                  {{ new Date(event.startDate).toLocaleDateString() }} -
                  {{ new Date(event.endDate).toLocaleDateString() }}
                </div>
                <div v-if="event.place" class="text-sm text-gray-600 mt-1">
                  {{ event.place }}
                </div>
                <div class="mt-3 flex justify-end">
                <span
                    :class="selectedEvent === event.eventID ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'"
                    class="px-3 py-1 rounded-full text-sm transition-colors"
                >
                  {{ selectedEvent === event.eventID ? 'Seleccionado' : 'Seleccionar' }}
                </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Individual Registration Form -->
        <div v-if="activeTab === 'individual'" class="tab-content">
          <div class="panel">
            <h2 class="panel-title">Registro Individual</h2>

            <form @submit.prevent="submitIndividualRegistration" class="form-container">
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Nombre</label>
                  <input
                      v-model="individualForm.name"
                      type="text"
                      required
                      class="form-input"
                      placeholder="Tu nombre"
                  >
                </div>

                <div class="form-group">
                  <label class="form-label">Apellido</label>
                  <input
                      v-model="individualForm.lastname"
                      type="text"
                      required
                      class="form-input"
                      placeholder="Tu apellido"
                  >
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Correo Electrónico</label>
                <input
                    v-model="individualForm.email"
                    type="email"
                    required
                    class="form-input"
                    placeholder="tu.correo@ejemplo.com"
                >
              </div>

              <!-- Course Selection -->
              <div class="form-group mt-6">
                <label class="form-label">Selecciona los Cursos (Opcional)</label>

                <div v-if="!selectedEvent" class="text-gray-500 text-sm mt-2 mb-4">
                  Selecciona primero un evento para ver los cursos disponibles.
                </div>

                <div v-else-if="loadingCourses" class="flex justify-center py-4">
                  <div class="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-900"></div>
                </div>

                <div v-else-if="courses.length === 0" class="text-gray-500 text-sm mt-2 mb-4">
                  No hay cursos disponibles para este evento.
                </div>

                <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  <div
                      v-for="course in courses"
                      :key="course.courseID"
                      class="border rounded-md overflow-hidden hover:bg-gray-50 transition-colors cursor-pointer"
                      :class="{ 'bg-gray-50 border-gray-800': selectedCourses.includes(course.courseID) }"
                      @click="toggleCourseSelection(course.courseID)"
                  >
                    <div class="p-3 flex items-center">
                      <div class="w-5 h-5 rounded border flex-shrink-0 mr-3"
                           :class="{ 'bg-gray-800 border-gray-800': selectedCourses.includes(course.courseID) }">
                        <svg v-if="selectedCourses.includes(course.courseID)" class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      <div>
                        <h4 class="font-medium text-gray-800">{{ course.name }}</h4>
                        <p v-if="course.courseDate" class="text-sm text-gray-600">
                          {{ new Date(course.courseDate).toLocaleDateString() }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-8">
                <button
                    type="submit"
                    :disabled="loading || !selectedEvent"
                    class="submit-button"
                    :class="{ 'opacity-50 cursor-not-allowed': loading || !selectedEvent }"
                >
                  {{ loading ? 'Procesando...' : 'Completar Registro' }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Group Registration Form -->
        <div v-if="activeTab === 'group'" class="tab-content">
          <div class="panel">
            <h2 class="panel-title">Registro de Profesor con Grupo</h2>

            <form @submit.prevent="submitGroupRegistration" class="form-container">
              <div class="mb-8">
                <h3 class="section-title">Información del Profesor</h3>
                <div class="form-grid">
                  <div class="form-group">
                    <label class="form-label">Nombre</label>
                    <input
                        v-model="teacherForm.name"
                        type="text"
                        required
                        class="form-input"
                        placeholder="Nombre del profesor"
                    >
                  </div>

                  <div class="form-group">
                    <label class="form-label">Apellido</label>
                    <input
                        v-model="teacherForm.lastname"
                        type="text"
                        required
                        class="form-input"
                        placeholder="Apellido del profesor"
                    >
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Correo Electrónico</label>
                  <input
                      v-model="teacherForm.email"
                      type="email"
                      required
                      class="form-input"
                      placeholder="profesor@institucion.edu"
                  >
                </div>

                <!-- Course Selection for Teacher -->
                <div class="form-group mt-6">
                  <label class="form-label">Selecciona los Cursos (Opcional)</label>

                  <div v-if="!selectedEvent" class="text-gray-500 text-sm mt-2 mb-4">
                    Selecciona primero un evento para ver los cursos disponibles.
                  </div>

                  <div v-else-if="loadingCourses" class="flex justify-center py-4">
                    <div class="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-900"></div>
                  </div>

                  <div v-else-if="courses.length === 0" class="text-gray-500 text-sm mt-2 mb-4">
                    No hay cursos disponibles para este evento.
                  </div>

                  <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                    <div
                        v-for="course in courses"
                        :key="course.courseID"
                        class="border rounded-md overflow-hidden hover:bg-gray-50 transition-colors cursor-pointer"
                        :class="{ 'bg-gray-50 border-gray-800': selectedCourses.includes(course.courseID) }"
                        @click="toggleCourseSelection(course.courseID)"
                    >
                      <div class="p-3 flex items-center">
                        <div class="w-5 h-5 rounded border flex-shrink-0 mr-3"
                             :class="{ 'bg-gray-800 border-gray-800': selectedCourses.includes(course.courseID) }">
                          <svg v-if="selectedCourses.includes(course.courseID)" class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                        </div>
                        <div>
                          <h4 class="font-medium text-gray-800">{{ course.name }}</h4>
                          <p v-if="course.courseDate" class="text-sm text-gray-600">
                            {{ new Date(course.courseDate).toLocaleDateString() }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Students Section -->
              <div class="mb-6">
                <div class="flex justify-between items-center mb-4">
                  <h3 class="section-title">Información de los Estudiantes</h3>
                  <button
                      type="button"
                      @click="addStudent"
                      class="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded text-sm transition-colors"
                  >
                    + Agregar Estudiante
                  </button>
                </div>

                <div v-for="(student, index) in students" :key="index" class="border rounded-lg p-4 mb-4">
                  <div class="flex justify-between items-center mb-4">
                    <h4 class="font-medium">Estudiante {{ index + 1 }}</h4>
                    <button
                        v-if="students.length > 1"
                        type="button"
                        @click="removeStudent(index)"
                        class="text-red-600 hover:text-red-800 text-sm"
                    >
                      Eliminar
                    </button>
                  </div>

                  <div class="form-grid">
                    <div class="form-group">
                      <label class="form-label">Nombre</label>
                      <input
                          v-model="student.name"
                          type="text"
                          required
                          class="form-input"
                          placeholder="Nombre del estudiante"
                      >
                    </div>

                    <div class="form-group">
                      <label class="form-label">Apellido</label>
                      <input
                          v-model="student.lastname"
                          type="text"
                          required
                          class="form-input"
                          placeholder="Apellido del estudiante"
                      >
                    </div>
                  </div>

                  <div class="form-group">
                    <label class="form-label">Correo Electrónico</label>
                    <input
                        v-model="student.email"
                        type="email"
                        required
                        class="form-input"
                        placeholder="estudiante@institucion.edu"
                    >
                  </div>

                  <!-- Course Selection for Student -->
                  <div class="form-group mt-4">
                    <label class="form-label">Cursos para este Estudiante (Opcional)</label>

                    <div v-if="!selectedEvent" class="text-gray-500 text-sm mt-2">
                      Selecciona primero un evento para ver los cursos disponibles.
                    </div>

                    <div v-else-if="loadingCourses" class="flex justify-center py-4">
                      <div class="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-900"></div>
                    </div>

                    <div v-else-if="courses.length === 0" class="text-gray-500 text-sm mt-2">
                      No hay cursos disponibles para este evento.
                    </div>

                    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                      <div
                          v-for="course in courses"
                          :key="course.courseID"
                          class="border rounded-md overflow-hidden hover:bg-gray-50 transition-colors cursor-pointer"
                          :class="{ 'bg-gray-50 border-gray-800': isStudentCourseSelected(index, course.courseID) }"
                          @click="toggleStudentCourse(index, course.courseID)"
                      >
                        <div class="p-2 flex items-center">
                          <div class="w-5 h-5 rounded border flex-shrink-0 mr-2"
                               :class="{ 'bg-gray-800 border-gray-800': isStudentCourseSelected(index, course.courseID) }">
                            <svg v-if="isStudentCourseSelected(index, course.courseID)" class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                          </div>
                          <div>
                            <h4 class="font-medium text-gray-800">{{ course.name }}</h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-8">
                <button
                    type="submit"
                    :disabled="loading || !selectedEvent"
                    class="submit-button"
                    :class="{ 'opacity-50 cursor-not-allowed': loading || !selectedEvent }"
                >
                  {{ loading ? 'Procesando...' : 'Completar Registro Grupal' }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Non-academics Registration Form -->
        <div v-if="activeTab === 'nonacademics'" class="tab-content">
          <div class="panel">
            <h2 class="panel-title">Registro Individual (No Academicos)</h2>
        
            <form @submit.prevent="submitNonacademicsRegistration" class="form-container">
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Nombre</label>
                  <input
                      v-model="nonacademicsForm.name"
                      type="text"
                      required
                      class="form-input"
                      placeholder="Tu nombre"
                  >
                </div>
        
                <div class="form-group">
                  <label class="form-label">Apellido</label>
                  <input
                      v-model="nonacademicsForm.lastname"
                      type="text"
                      required
                      class="form-input"
                      placeholder="Tu apellido"
                  >
                </div>
              </div>
        
              <div class="form-group">
                <label class="form-label">Correo Electrónico</label>
                <input
                    v-model="nonacademicsForm.email"
                    type="email"
                    required
                    class="form-input"
                    placeholder="tu.correo@ejemplo.com"
                >
              </div>
        
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Empresa</label>
                  <input
                      v-model="nonacademicsForm.company"
                      type="text"
                      required
                      class="form-input"
                      placeholder="Nombre de la empresa"
                  >
                </div>
        
                <div class="form-group">
                  <label class="form-label">Cargo</label>
                  <input
                      v-model="nonacademicsForm.position"
                      type="text"
                      required
                      class="form-input"
                      placeholder="Tu cargo o posición"
                  >
                </div>
              </div>
        
              <!-- Course Selection -->
              <div class="form-group mt-6">
                <label class="form-label">Selecciona los Cursos (Opcional)</label>
        
                <div v-if="!selectedEvent" class="text-gray-500 text-sm mt-2 mb-4">
                  Selecciona primero un evento para ver los cursos disponibles.
                </div>
        
                <div v-else-if="loadingCourses" class="flex justify-center py-4">
                  <div class="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-900"></div>
                </div>
        
                <div v-else-if="courses.length === 0" class="text-gray-500 text-sm mt-2 mb-4">
                  No hay cursos disponibles para este evento.
                </div>
        
                <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  <div
                      v-for="course in courses"
                      :key="course.courseID"
                      class="border rounded-md overflow-hidden hover:bg-gray-50 transition-colors cursor-pointer"
                      :class="{ 'bg-gray-50 border-gray-800': selectedCourses.includes(course.courseID) }"
                      @click="toggleCourseSelection(course.courseID)"
                  >
                    <div class="p-3 flex items-center">
                      <div class="w-5 h-5 rounded border flex-shrink-0 mr-3"
                           :class="{ 'bg-gray-800 border-gray-800': selectedCourses.includes(course.courseID) }">
                        <svg v-if="selectedCourses.includes(course.courseID)" class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      <div>
                        <h4 class="font-medium text-gray-800">{{ course.name }}</h4>
                        <p v-if="course.courseDate" class="text-sm text-gray-600">
                          {{ new Date(course.courseDate).toLocaleDateString() }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
        
              <div class="mt-8">
                <button
                    type="submit"
                    :disabled="loading || !selectedEvent"
                    class="submit-button"
                    :class="{ 'opacity-50 cursor-not-allowed': loading || !selectedEvent }"
                >
                  {{ loading ? 'Procesando...' : 'Completar Registro' }}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <!-- Message display -->
        <div v-if="message" class="message-container">
          <div :class="['message', messageType === 'success' ? 'success-message' : 'error-message']">
            {{ message }}
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<style scoped>
.register-page {
  min-height: 100vh;
  background-color: #f8fafc;
  font-family: 'Noto Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
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

.section-title {
  font-size: 1.25rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 1rem;
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
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background-color: white;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}

.submit-button {
  padding: 0.75rem 1.5rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover:not(:disabled) {
  background-color: #2563eb;
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
  .form-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
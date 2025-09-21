<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useEditableEvents, useEditableSpeakers, useEditableCourses, useEditableLectures } from '~/composables/useEditableItems';

definePageMeta({
  layout: 'default',
});

// Definir variables reactivas para almacenar los datos
const events = ref([]);
const speakers = ref([]);
const featuredEvent = ref(null);
const courses = ref([]);
const lectures = ref([]);
const isLoading = ref(true);

// Función para formatear fechas
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-ES', options);
};

// Cargar los datos al montar el componente
onMounted(async () => {
  try {
    // Obtener eventos
    events.value = await useEditableEvents();
    
    // Establecer el evento destacado (el primero o el más próximo)
    if (events.value.length > 0) {
      featuredEvent.value = events.value[0];
      
      // Obtener cursos y conferencias del evento destacado
      courses.value = await useEditableCourses(featuredEvent.value.eventID);
      lectures.value = await useEditableLectures(featuredEvent.value.eventID);
    }
    
    // Obtener ponentes
    speakers.value = await useEditableSpeakers();
  } catch (error) {
    console.error('Error al cargar datos:', error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <NuxtLayout>
    <div class="container">
      <!-- Sección de carga -->
      <div v-if="isLoading" class="loading-container">
        <div class="loader"></div>
      </div>
      
      <div v-else class="content-wrapper">
        <!-- Evento destacado -->
        <section v-if="featuredEvent" class="section featured-event">
          <div class="event-card featured">
            <div class="card-content">
              <span class="event-badge">Evento Destacado</span>
              <h1 class="event-title">{{ featuredEvent.name }}</h1>
              <div class="event-details">
                <div class="event-detail">
                  <i class="fas fa-calendar-alt"></i>
                  <span>{{ formatDate(featuredEvent.startDate) }} - {{ formatDate(featuredEvent.endDate) }}</span>
                </div>
                <div class="event-detail">
                  <i class="fas fa-map-marker-alt"></i>
                  <span>{{ featuredEvent.place }}</span>
                </div>
              </div>
              <a :href="featuredEvent.link" target="_blank" class="btn btn-primary">
                Más información
              </a>
            </div>
          </div>
        </section>
        
        <!-- Próximos eventos -->
        <section class="section">
          <h2 class="section-title">Próximos Eventos</h2>
          <div v-if="events.length > 0" class="card-grid events-grid">
            <div v-for="event in events.slice(0, 3)" :key="event.eventID" class="card event-card">
              <div class="card-body">
                <h3 class="card-title">{{ event.name }}</h3>
                <p class="event-date">{{ formatDate(event.startDate) }} - {{ formatDate(event.endDate) }}</p>
                <p class="event-location">{{ event.place }}</p>
                <a :href="event.link" target="_blank" class="card-link">
                  Leer más →
                </a>
              </div>
            </div>
          </div>
          <div v-else class="empty-state">
            <p>No hay eventos próximos disponibles.</p>
          </div>
        </section>
        
        <!-- Cursos destacados -->
        <section class="section">
          <h2 class="section-title">Cursos Destacados</h2>
          <div v-if="courses.length > 0" class="card-grid courses-grid">
            <div v-for="course in courses" :key="course.courseID" class="card course-card">
              <div class="course-header">
                <span class="course-date">{{ formatDate(course.courseDate) }}</span>
                <span class="course-badge">Curso</span>
              </div>
              <div class="card-body">
                <h3 class="card-title">{{ course.name }}</h3>
                <div v-if="speakers.length > 0" class="instructor">
                  <div class="avatar">
                    <i class="fas fa-user"></i>
                  </div>
                  <div class="instructor-info">
                    <p class="instructor-name">
                      {{ speakers.find(s => s.speakerID === course.speakerID)?.name || '' }} 
                      {{ speakers.find(s => s.speakerID === course.speakerID)?.lastname || '' }}
                    </p>
                    <p class="instructor-role">Instructor</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="empty-state">
            <p>No hay cursos disponibles actualmente.</p>
          </div>
        </section>
        
        <!-- Ponentes destacados -->
        <section class="section">
          <h2 class="section-title">Ponentes Destacados</h2>
          <div v-if="speakers.length > 0" class="card-grid speakers-grid">
            <div v-for="speaker in speakers.slice(0, 8)" :key="speaker.speakerID" class="card speaker-card">
              <div class="speaker-header">
                <div class="speaker-avatar">
                  {{ speaker.name.charAt(0) }}{{ speaker.lastname.charAt(0) }}
                </div>
              </div>
              <div class="card-body text-center">
                <h3 class="speaker-name">{{ speaker.name }} {{ speaker.lastname }}</h3>
                <p class="speaker-role">Experto</p>
              </div>
            </div>
          </div>
          <div v-else class="empty-state">
            <p>No hay ponentes disponibles actualmente.</p>
          </div>
        </section>
        
        <!-- Conferencias destacadas -->
        <section class="section">
          <h2 class="section-title">Conferencias Destacadas</h2>
          <div v-if="lectures.length > 0" class="card-grid lectures-grid">
            <div v-for="lecture in lectures" :key="lecture.lectureID" class="card lecture-card">
              <div class="card-body">
                <div class="lecture-header">
                  <h3 class="card-title">{{ lecture.name }}</h3>
                  <span class="lecture-date">
                    {{ formatDate(lecture.lectureDate) }}
                  </span>
                </div>
                <div v-if="speakers.length > 0" class="speaker">
                  <div class="avatar">
                    <i class="fas fa-user"></i>
                  </div>
                  <div class="speaker-info">
                    <p class="speaker-name">
                      {{ speakers.find(s => s.speakerID === lecture.speakerID)?.name || '' }} 
                      {{ speakers.find(s => s.speakerID === lecture.speakerID)?.lastname || '' }}
                    </p>
                    <p class="speaker-role">Ponente</p>
                  </div>
                </div>
              </div>
              <div class="card-footer">
                <a :href="lecture.paymentLink" target="_blank" class="card-link">
                  <span>Inscríbete ahora</span>
                  <i class="fas fa-arrow-right"></i>
                </a>
              </div>
            </div>
          </div>
          <div v-else class="empty-state">
            <p>No hay conferencias disponibles actualmente.</p>
          </div>
        </section>
        
        <!-- Call to Action -->
        <section class="section">
          <div class="cta-container">
            <div class="cta-content">
              <h2 class="cta-title">¿Interesado en nuestros eventos?</h2>
              <p class="cta-text">Únete a nuestra comunidad y mantente al día con los próximos eventos, cursos y conferencias.</p>
              <button class="btn btn-white">
                Contáctanos
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  </NuxtLayout>
</template>

<style scoped>
/* Estilos generales */
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

.content-wrapper {
  margin-top: 48px;
}

.section {
  margin-bottom: 80px;
}

.section-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 32px;
  color: #1f2937;
  border-bottom: 2px solid #3b82f6;
  padding-bottom: 12px;
  display: inline-block;
}

/* Grillas de tarjetas */
.card-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

.events-grid, .courses-grid {
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
}

.speakers-grid {
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
}

.lectures-grid {
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
}

/* Tarjetas comunes */
.card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.card-body {
  padding: 24px;
}

.card-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #1f2937;
}

.card-link {
  color: #2563eb;
  font-weight: 500;
  text-decoration: none;
  display: flex;
  align-items: center;
}

.card-link:hover {
  color: #1d4ed8;
}

.card-link i {
  margin-left: 8px;
  transition: transform 0.2s ease;
}

.card-link:hover i {
  transform: translateX(4px);
}

.card-footer {
  background-color: #f9fafb;
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
}

/* Evento destacado */
.featured-event {
  margin-bottom: 64px;
}

.event-card.featured {
  background: linear-gradient(to right, #2563eb, #4f46e5);
  color: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.event-title {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 16px;
  line-height: 1.2;
}

.event-badge {
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
  color: white;
  font-size: 14px;
  padding: 4px 16px;
  border-radius: 50px;
  display: inline-block;
  margin-bottom: 16px;
  text-transform: uppercase;
  font-weight: 600;
}

.event-details {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.event-detail {
  display: flex;
  align-items: center;
  font-size: 18px;
}

.event-detail i {
  margin-right: 12px;
  color: rgba(255, 255, 255, 0.8);
}

@media (min-width: 768px) {
  .event-details {
    flex-direction: row;
    gap: 24px;
  }
}

/* Eventos */
.event-date {
  color: #6b7280;
  margin-bottom: 16px;
}

.event-location {
  color: #374151;
  margin-bottom: 16px;
}

/* Cursos */
.course-header {
  background-color: #dbeafe;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.course-date {
  color: #1e40af;
  font-weight: 500;
}

.course-badge {
  background-color: #2563eb;
  color: white;
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 50px;
  text-transform: uppercase;
  font-weight: 600;
}

.instructor {
  display: flex;
  align-items: center;
  margin-top: 16px;
}

.avatar {
  width: 40px;
  height: 40px;
  background-color: #e5e7eb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4b5563;
}

.instructor-info {
  margin-left: 12px;
}

.instructor-name {
  font-size: 14px;
  color: #1f2937;
  font-weight: 500;
}

.instructor-role {
  font-size: 12px;
  color: #6b7280;
}

/* Ponentes */
.speaker-card {
  text-align: center;
}

.speaker-header {
  height: 128px;
  background: linear-gradient(to right, #374151, #111827);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.5s ease;
}

.speaker-card:hover .speaker-header {
  background: linear-gradient(to right, #2563eb, #4f46e5);
}

.speaker-avatar {
  width: 80px;
  height: 80px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.speaker-name {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  text-align: center;
}

.speaker-role {
  font-size: 14px;
  color: #6b7280;
  text-align: center;
}

/* Conferencias */
.lecture-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.lecture-date {
  background-color: #e0e7ff;
  color: #4338ca;
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 50px;
  align-self: flex-start;
}

.speaker {
  display: flex;
  align-items: center;
  margin-top: 16px;
}

.speaker-info {
  margin-left: 12px;
}

.speaker-name {
  font-size: 14px;
  color: #1f2937;
  font-weight: 500;
}

.speaker-role {
  font-size: 12px;
  color: #6b7280;
}

/* Call to Action */
.cta-container {
  background: linear-gradient(to right, #4f46e5, #7c3aed);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.cta-content {
  padding: 40px;
  text-align: center;
  color: white;
}

.cta-title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 16px;
}

.cta-text {
  font-size: 18px;
  margin-bottom: 24px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

/* Botones */
.btn {
  display: inline-block;
  padding: 12px 24px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn:hover {
  transform: scale(1.05);
}

.btn-primary {
  background-color: white;
  color: #2563eb;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.btn-primary:hover {
  background-color: #f9fafb;
}

.btn-white {
  background-color: white;
  color: #4f46e5;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 16px 32px;
}

.btn-white:hover {
  background-color: #f9fafb;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

/* Estado vacío */
.empty-state {
  text-align: center;
  padding: 32px;
  color: #6b7280;
}

/* Animación de carga */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.loader {
  border: 5px solid rgba(226, 232, 240, 0.5);
  border-top: 5px solid #3b82f6;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Media queries */
@media (max-width: 768px) {
  .card-grid {
    gap: 16px;
  }
  
  .section {
    margin-bottom: 48px;
  }
  
  .event-title {
    font-size: 28px;
  }
  
  .section-title {
    font-size: 24px;
  }
  
  .cta-title {
    font-size: 28px;
  }
  
  .cta-text {
    font-size: 16px;
  }
  
  .lecture-header {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (min-width: 768px) {
  .lecture-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
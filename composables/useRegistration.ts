import { ref } from 'vue';

interface RegistrationResponse {
  success: boolean;
  message: string;
}

export function useRegistration() {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const success = ref<string | null>(null);

  // Register an individual attendee
  async function registerAttendee(data: {
    eventID: string | number;
    name: string;
    lastname: string;
    email: string;
    institution: string;
    faculty: string;
    charge?: string;
    courses?: string | string[];
  }): Promise<RegistrationResponse> {
    loading.value = true;
    error.value = null;
    success.value = null;
  
    try {
      // Preparar los datos para asegurar compatibilidad
      const postData = { ...data };
      
      // Si courses es un array, convertirlo a string separado por espacios
      if (Array.isArray(postData.courses)) {
        postData.courses = postData.courses.join(' ');
      }
      
      // Si courses está vacío, eliminarlo del objeto
      if (!postData.courses) {
        delete postData.courses;
      }
      
      // Validar que todos los campos requeridos estén presentes
      const requiredFields = ['eventID', 'name', 'lastname', 'email', 'institution', 'faculty'];
      for (const field of requiredFields) {
        if (!postData[field]) {
          throw new Error(`El campo ${field} es requerido para el registro`);
        }
      }
      
      const response = await fetch('http://localhost:3100/register/attendee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || 'Error en el registro');
      }
      
      success.value = responseData.message || '¡Registro exitoso! Tu solicitud ha sido recibida.';
      return {
        success: true,
        message: success.value
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido durante el registro';
      error.value = errorMessage;
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      loading.value = false;
    }
  }

  // Register a teacher group
  async function registerTeacherGroup(teacher: any, students: any[]): Promise<RegistrationResponse> {
    loading.value = true;
    error.value = null;
    success.value = null;

    try {
      // Validate required fields for teacher
      const requiredTeacherFields = ['eventID', 'name', 'lastname', 'email', 'institution', 'faculty'];
      for (const field of requiredTeacherFields) {
        if (!teacher[field]) {
          throw new Error(`El campo ${field} es requerido para el registro del profesor`);
        }
      }
      
      // Validate required fields for each student
      for (let i = 0; i < students.length; i++) {
        const student = students[i];
        for (const field of requiredTeacherFields) {
          if (!student[field]) {
            throw new Error(`El campo ${field} es requerido para el estudiante ${i+1}`);
          }
        }
      }
      
      // Format data as expected by the API
      const teacherData = [teacher];
      
      const response = await fetch('http://localhost:3100/register/teacher', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          teacher: JSON.stringify({ data: teacherData }),
          students: JSON.stringify({ data: students })
        })
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || 'Error en el registro grupal');
      }
      
      success.value = responseData.message || '¡Registro grupal exitoso! Tu solicitud ha sido recibida.';
      return {
        success: true,
        message: success.value
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido durante el registro grupal';
      error.value = errorMessage;
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    error,
    success,
    registerAttendee,
    registerTeacherGroup
  };
}

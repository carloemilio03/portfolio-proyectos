import { authFetch } from './useAuthFetch'

// Tipos de datos para los elementos editables
export interface EditableEvent {
    eventID: number;
    name: string;
    link: string;
    startDate: string;
    endDate: string;
    place: string;
}

export interface EditableCourse {
    courseID: number;
    name: string;
    eventID: number;
    speakerID: number;
    courseDate: string;
}

export interface EditableSpeaker {
    speakerID: number;
    name: string;
    lastname: string;
    email: string;
}

export interface EditableLecture {
    lectureID: number;
    eventID: number;
    speakerID: number;
    name: string;
    lectureDate: string;
    paymentLink: string;
}

export interface EditableAttendee {
    attendeeID: number;
    name: string;
    lastname: string;
    email: string;
    paymentLink: string;
}

// URLs para los diferentes endpoints
const API_URL = 'http://localhost:3100/edit'

// Función para obtener eventos editables
export async function useEditableEvents(): Promise<EditableEvent[]> {
    try {
        const response = await authFetch(`${API_URL}/event`)
        return response.message || []
    } catch (error) {
        console.error('Error al obtener eventos para editar:', error)
        return []
    }
}

// Función para obtener cursos editables de un evento específico
export async function useEditableCourses(eventID: string | number): Promise<EditableCourse[]> {
    try {
        const response = await authFetch(`${API_URL}/course`, {
            headers: {
                eventid: eventID.toString()
            }
        })
        return response.message || []
    } catch (error) {
        console.error('Error al obtener cursos para editar:', error)
        return []
    }
}

// Función para obtener ponentes editables
export async function useEditableSpeakers(): Promise<EditableSpeaker[]> {
    try {
        const response = await authFetch(`${API_URL}/speaker`)
        return response.message || []
    } catch (error) {
        console.error('Error al obtener ponentes para editar:', error)
        return []
    }
}

// Función para obtener conferencias editables de un evento específico
export async function useEditableLectures(eventID: string | number): Promise<EditableLecture[]> {
    try {
        const response = await authFetch(`${API_URL}/lecture`, {
            headers: {
                eventid: eventID.toString()
            }
        })
        return response.message || []
    } catch (error) {
        console.error('Error al obtener conferencias para editar:', error)
        return []
    }
}

// Función para obtener asistentes editables de un evento específico
export async function useEditableAttendees(eventID: string | number): Promise<EditableAttendee[]> {
    try {
        const response = await authFetch(`${API_URL}/attendee`, {
            headers: {
                eventid: eventID.toString()
            }
        })
        return response.message || []
    } catch (error) {
        console.error('Error al obtener asistentes para editar:', error)
        return []
    }
}

// Función para actualizar un evento
export async function updateEvent(event: EditableEvent): Promise<boolean> {
    try {
        await authFetch(`${API_URL}/event`, {
            method: 'PUT',
            body: event
        })
        return true
    } catch (error) {
        console.error('Error al actualizar evento:', error)
        return false
    }
}

// Función para actualizar un curso
export async function updateCourse(course: EditableCourse): Promise<boolean> {
    try {
        await authFetch(`${API_URL}/course`, {
            method: 'PUT',
            body: course
        })
        return true
    } catch (error) {
        console.error('Error al actualizar curso:', error)
        return false
    }
}

// Función para actualizar un ponente
export async function updateSpeaker(speaker: EditableSpeaker): Promise<boolean> {
    try {
        await authFetch(`${API_URL}/speaker`, {
            method: 'PUT',
            body: speaker
        })
        return true
    } catch (error) {
        console.error('Error al actualizar ponente:', error)
        return false
    }
}

// Función para actualizar una conferencia
export async function updateLecture(lecture: EditableLecture): Promise<boolean> {
    try {
        await authFetch(`${API_URL}/lecture`, {
            method: 'PUT',
            body: lecture
        })
        return true
    } catch (error) {
        console.error('Error al actualizar conferencia:', error)
        return false
    }
}

// Función para actualizar un asistente
export async function updateAttendee(attendee: EditableAttendee): Promise<boolean> {
    try {
        await authFetch(`${API_URL}/attendee`, {
            method: 'PUT',
            body: attendee
        })
        return true
    } catch (error) {
        console.error('Error al actualizar asistente:', error)
        return false
    }
}

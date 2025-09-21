import axios from 'axios'

// Definimos el tipo para nuestros speakers
interface SpeakerItem {
    speakerID: number;
    name: string;
    // Agrega aquí otras propiedades si las hubiera
}

// El tipo de la respuesta completa de la API
interface ApiResponse {
    message: SpeakerItem[];
    // Podría haber otras propiedades en la respuesta
}

const API_BASE_URL = 'http://localhost:3100'

export async function useAvailableSpeakers(): Promise<SpeakerItem[] | null> {
    try {
        // Especificamos el tipo esperado de la respuesta de axios.get
        const response = await axios.get<ApiResponse>(`${API_BASE_URL}/content/speakers`)

        // Verificamos que response.data y response.data.message existan
        if (response.data && response.data.message) {
            return response.data.message // Devuelve directamente el array de speakers
        }
        // Si la estructura no es la esperada o no hay 'message',
        // puedes devolver un array vacío o null según tu lógica de manejo.
        console.warn('La respuesta de la API no contiene la propiedad "message" o está vacía.')
        return null // O [] si prefieres un array vacío como valor por defecto
    } catch (err) {
        console.error('Error al obtener speakers:', err)
        // Puedes ser más específico con el error si es una instancia de AxiosError
        if (axios.isAxiosError(err)) {
            console.error('Detalles del error Axios:', err.response?.data || err.message);
        }
        return null
    }
}

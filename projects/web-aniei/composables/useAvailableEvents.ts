import axios from 'axios'

// Es una buena práctica definir el tipo para tus eventos
interface EventItem {
    eventID: number;
    name: string;
    // Agrega aquí otras propiedades si las hubiera
}

// El tipo de la respuesta completa de la API, si solo te interesa 'message'
interface ApiResponse {
    message: EventItem[];
    // Podría haber otras propiedades en la respuesta
}

const API_BASE_URL = 'http://localhost:3100'

export async function useAvailableEvents(): Promise<EventItem[] | null> {
    try {
        // Especificamos el tipo esperado de la respuesta de axios.get
        const response = await axios.get<ApiResponse>(`${API_BASE_URL}/content`)

        // Verificamos que response.data y response.data.message existan
        if (response.data && response.data.message) {
            return response.data.message // Devuelve directamente el array de eventos
        }
        // Si la estructura no es la esperada o no hay 'message',
        // puedes devolver un array vacío o null según tu lógica de manejo.
        console.warn('La respuesta de la API no contiene la propiedad "message" o está vacía.')
        return null // O [] si prefieres un array vacío como valor por defecto
    } catch (err) {
        console.error('Error al obtener eventos:', err)
        // Puedes ser más específico con el error si es una instancia de AxiosError
        if (axios.isAxiosError(err)) {
            console.error('Detalles del error Axios:', err.response?.data || err.message);
        }
        return null
    }
}
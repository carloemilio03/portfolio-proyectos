// composables/useToken.ts
import axios from 'axios'
import { useUserStore } from '~/stores/userStore'

const API_BASE_URL = 'http://localhost:3100'

export async function useToken(): Promise<string | null> {
    const userStore = useUserStore()
    const userkey = userStore.userKey

    if (!userkey) {
        console.error('No hay userKey en el store')
        return null
    }

    try {
        const response = await axios.get(`${API_BASE_URL}/login/getToken`, {
            headers: {
                'userkey': userkey
            }
        })

        return response.data?.token || null
    } catch (err) {
        console.error('Error al obtener el token:', err)
        return null
    }
}
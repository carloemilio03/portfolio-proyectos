import { useToken } from './useToken'

export async function authFetch(url: string, options: any = {}) {
    const token = await useToken()

    if (!token) {
        throw new Error('No se pudo obtener el token')
    }

    options.headers = {
        ...(options.headers || {}),
        authorization: token
    }

    return await $fetch(url, options)
}

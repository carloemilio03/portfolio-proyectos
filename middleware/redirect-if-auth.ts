// middleware/redirect-if-auth.ts
import { useUserStore } from '@/stores/userStore'

export default defineNuxtRouteMiddleware(() => {
    const userStore = useUserStore()
    if (userStore.isAuthenticated) {
        console.log(userStore.isAuthenticated)
        return navigateTo('/panelAdmin')
    }
})

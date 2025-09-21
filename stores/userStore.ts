// stores/userStore.ts
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    userKey: null as string | null,
    mail: null as string | null,
    role: null as string | null,
  }),
  
  getters: {
    isAuthenticated(): boolean {
      // Verifica si hay userKey
      return !!this.userKey
    }
  },
  
  actions: {
    initialize() {
      // Solo ejecutar en el cliente
      if (process.client) {
        const userKey = localStorage.getItem('userKey')
        const mail = localStorage.getItem('mail')
        const role = localStorage.getItem('role')
        
        if (userKey) this.userKey = userKey
        if (mail) this.mail = mail
        if (role) this.role = role
      }
    },
    
    login(userKey: string, mail: string, role: string) {
      this.userKey = userKey
      this.mail = mail
      this.role = role
      
      // Solo ejecutar en el cliente
      if (process.client) {
        localStorage.setItem('userKey', userKey)
        localStorage.setItem('mail', mail)
        localStorage.setItem('role', role)
      }
    },
    
    logout() {
      this.userKey = null
      this.mail = null
      this.role = null
      
      // Solo ejecutar en el cliente
      if (process.client) {
        localStorage.removeItem('userKey')
        localStorage.removeItem('mail')
        localStorage.removeItem('role')
      }
    }
  }
})
<template>
  <div class="space-y-6">
    <v-card>
      <v-card-title>Available Certificates</v-card-title>
      <v-card-text>
        <v-btn color="primary" @click="fetchCertificates">Load Certificates</v-btn>
        <v-list v-if="certificates.length">
          <v-list-item
              v-for="cert in certificates"
              :key="cert.id"
              class="flex justify-between"
          >
            <div>
              <p class="font-semibold">{{ cert.title }}</p>
              <p class="text-sm text-gray-500">{{ cert.description }}</p>
            </div>
            <v-btn @click="downloadCertificate(cert.id)" color="secondary">Download</v-btn>
          </v-list-item>
        </v-list>
        <p v-else class="text-gray-500 mt-4">No certificates available.</p>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const API = 'http://localhost:3100/'

const certificates = ref([])

async function fetchCertificates() {
  try {
    const res = await axios.get(`${API}content/certificate`)
    certificates.value = res.data
  } catch (err) {
    console.error('Error fetching certificates', err)
  }
}

async function downloadCertificate(id) {
  try {
    const res = await axios.get(`${API}content/download`, {
      responseType: 'blob',
      params: { certificateId: id }
    })

    // Simulate download
    const url = window.URL.createObjectURL(new Blob([res.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `certificate_${id}.pdf`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (err) {
    console.error('Error downloading certificate', err)
  }
}
</script>

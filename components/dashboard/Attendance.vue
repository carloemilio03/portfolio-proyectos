<template>
  <div class="space-y-6">
    <v-card>
      <v-card-title>Register Attendance</v-card-title>
      <v-card-text class="space-y-4">
        <v-text-field v-model="attendeeId" label="Attendee ID" />
        <v-select v-model="type" :items="types" label="Attendance Type" />

        <v-btn color="success" @click="registerAttendance">Register</v-btn>
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-title>Search Attendee / Teacher</v-card-title>
      <v-card-text class="space-y-4">
        <v-text-field v-model="searchId" label="ID" />
        <v-select v-model="searchType" :items="searchTypes" label="Type" />
        <v-btn @click="searchPerson">Search</v-btn>

        <div v-if="searchResult">
          <pre>{{ searchResult }}</pre>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const API = 'http://localhost:3100/'

const attendeeId = ref('')
const type = ref('')
const types = ['course', 'event', 'organizer']

const searchId = ref('')
const searchType = ref('')
const searchTypes = ['attendee', 'teacher']
const searchResult = ref(null)

async function registerAttendance() {
  try {
    await axios.post(`${API}attend/${type.value}`, {
      attendeeId: attendeeId.value,
    }, {
      headers: { Authorization: `Bearer ${await getToken()}` },
    })
    attendeeId.value = ''
    type.value = ''
    alert('Attendance registered successfully')
  } catch (err) {
    console.error('Error registering attendance', err)
  }
}

async function searchPerson() {
  try {
    const res = await axios.get(`${API}attend/${searchType.value}`, {
      headers: { Authorization: `Bearer ${await getToken()}` },
      params: { id: searchId.value },
    })
    searchResult.value = res.data
  } catch (err) {
    console.error('Error searching person', err)
    searchResult.value = 'Not found or error'
  }
}

// Mock token logic
async function getToken() {
  return 'your-valid-token-here'
}
</script>

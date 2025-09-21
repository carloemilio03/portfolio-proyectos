<template>
  <div class="space-y-4">
    <v-card>
      <v-card-title>All Events</v-card-title>
      <v-card-text>
        <v-btn @click="fetchEvents" color="primary" class="mb-4">Refresh</v-btn>
        <v-list>
          <v-list-item v-for="event in events" :key="event.id">
            <v-card>
              <v-list-item-title>{{ event.name }}</v-list-item-title>
            </v-card>
            <v-btn color="secondary" @click="editEvent(event.id)">Edit</v-btn>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-title>Create Event</v-card-title>
      <v-card-text>
        <v-text-field v-model="newEvent.name" label="Event Name" />
        <v-btn color="success" @click="createEvent">Create</v-btn>
      </v-card-text>
    </v-card>

    <v-dialog v-model="editDialog" max-width="500px">
      <v-card>
        <v-card-title>Edit Event</v-card-title>
        <v-card-text>
          <v-text-field v-model="editData.name" label="Event Name" />
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="submitEdit">Save</v-btn>
          <v-btn @click="editDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const events = ref([])
const newEvent = ref({ name: '' })
const editDialog = ref(false)
const editData = ref({ id: null, name: '' })

const API = 'http://localhost:3100/'

async function fetchEvents() {
  try {
    const res = await axios.get(`${API}content/`)
    events.value = res.data
  } catch (err) {
    console.error('Error fetching events', err)
  }
}

async function createEvent() {
  try {
    await axios.post(`${API}create/event`, newEvent.value, {
      headers: { Authorization: `Bearer ${await getToken()}` },
    })
    newEvent.value.name = ''
    fetchEvents()
  } catch (err) {
    console.error('Error creating event', err)
  }
}

async function editEvent(id) {
  try {
    const res = await axios.get(`${API}edit/event`, {
      headers: { Authorization: `Bearer ${await getToken()}` },
      params: { id },
    })
    editData.value = { ...res.data, id }
    editDialog.value = true
  } catch (err) {
    console.error('Error loading event for editing', err)
  }
}

async function submitEdit() {
  try {
    await axios.put(`${API}edit/event`, editData.value, {
      headers: { Authorization: `Bearer ${await getToken()}` },
    })
    editDialog.value = false
    fetchEvents()
  } catch (err) {
    console.error('Error editing event', err)
  }
}

// Mock function – replace this with your real token logic
async function getToken() {

}
</script>

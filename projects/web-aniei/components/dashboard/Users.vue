<template>
  <div class="space-y-6">
    <v-card>
      <v-card-title>Current User Info</v-card-title>
      <v-card-text>
        <v-btn color="primary" @click="fetchUser">Load My Info</v-btn>
        <div v-if="user">
          <p><strong>ID:</strong> {{ user.id }}</p>
          <p><strong>Name:</strong> {{ user.name }}</p>
          <p><strong>Email:</strong> {{ user.email }}</p>
        </div>
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-title>Update My Info</v-card-title>
      <v-card-text class="space-y-2">
        <v-text-field v-model="userForm.name" label="Name" />
        <v-text-field v-model="userForm.email" label="Email" />
        <v-btn color="success" @click="updateUser">Update</v-btn>
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-title>Create New User</v-card-title>
      <v-card-text class="space-y-2">
        <v-text-field v-model="newUser.name" label="Name" />
        <v-text-field v-model="newUser.email" label="Email" />
        <v-text-field v-model="newUser.password" label="Password" type="password" />
        <v-btn color="success" @click="createUser">Create</v-btn>
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-title>Reset Password</v-card-title>
      <v-card-text class="space-y-2">
        <v-text-field v-model="resetData.email" label="User Email" />
        <v-text-field v-model="resetData.newPassword" label="New Password" type="password" />
        <v-btn color="warning" @click="resetPassword">Reset</v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const API = 'http://localhost:3100/'

const user = ref(null)
const userForm = ref({ name: '', email: '' })
const newUser = ref({ name: '', email: '', password: '' })
const resetData = ref({ email: '', newPassword: '' })

async function fetchUser() {
  try {
    const res = await axios.get(`${API}user/`, {
      headers: { Authorization: `Bearer ${await getToken()}` },
    })
    user.value = res.data
    userForm.value.name = res.data.name
    userForm.value.email = res.data.email
  } catch (err) {
    console.error('Error fetching user info', err)
  }
}

async function updateUser() {
  try {
    await axios.put(`${API}user/`, userForm.value, {
      headers: { Authorization: `Bearer ${await getToken()}` },
    })
    alert('User updated')
  } catch (err) {
    console.error('Error updating user info', err)
  }
}

async function createUser() {
  try {
    await axios.post(`${API}user/`, newUser.value, {
      headers: { Authorization: `Bearer ${await getToken()}` },
    })
    newUser.value = { name: '', email: '', password: '' }
    alert('User created')
  } catch (err) {
    console.error('Error creating user', err)
  }
}

async function resetPassword() {
  try {
    await axios.post(`${API}user/swapPassword`, resetData.value, {
      headers: { Authorization: `Bearer ${await getToken()}` },
    })
    resetData.value = { email: '', newPassword: '' }
    alert('Password reset')
  } catch (err) {
    console.error('Error resetting password', err)
  }
}

// Mock token logic
async function getToken() {
  return 'your-valid-token-here'
}
</script>

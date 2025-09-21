# ANIEI Frontend

## Overview
The ANIEI Frontend is a web application built with **Nuxt.js** and **Vue 3**. It provides functionality for user authentication, registration, QR code scanning, and administrative features. The application uses modern web technologies to deliver a responsive and user-friendly experience.

---

## 🧱 Technology Stack
- **Framework**: Nuxt.js `3.15.4`
- **Language**: TypeScript
- **UI Framework**: Vue `3.5.13`
- **State Management**: Pinia `3.0.2`
- **HTTP Client**: Axios `1.9.0`
- **Routing**: Vue Router `4.5.0`
- **CSS**: Tailwind CSS `4.0.11`
- **UI Components**: Vuetify (via `vuetify-nuxt-module@0.18.6`)

---

## 📁 Project Structure
The project follows the standard Nuxt 3 structure:

- `/components`: Reusable Vue components
- `/composables`: Custom logic composables
- `/pages`: Application routes and views
- `/public`: Static assets
- `/stores`: Pinia stores

---

## 🧩 Key Components

### `Navbar.vue`
Provides main app navigation:
- Fully responsive (desktop + mobile)
- Shows different links based on auth status
- User dropdown (role info + logout)
- Mobile toggle menu

---

## 🔐 Authentication System

Authentication is handled using `userStore` (Pinia):
- Login / Logout
- Role-based user control
- Persistent auth state
- Token-based auth system

### 🔄 Authentication Flow
1. User logs in through `/login`
2. User info is stored in `userStore`
3. Token is retrieved using `useToken` composable
4. UI updates dynamically based on auth state and role

---

## 🧪 Composables

### `useToken`
Responsible for retrieving auth tokens:
- Uses userKey from `userStore`
- Makes request to `/login/getToken`
- Returns token for API usage

---

## 🗺 Routes / Pages

| Route        | Description                        |
|--------------|------------------------------------|
| `/`          | Home page                          |
| `/register`  | User registration                  |
| `/escanear`  | QR scanning page                   |
| `/login`     | Admin login                        |
| `/panelAdmin`| Admin dashboard (auth required)    |

---

## 🧑‍💼 User Roles

- **Unauthenticated Users**: Access to home, register, scan
- **Authenticated Users**: Access to `/panelAdmin` and role-specific features

---

## ⚙️ Development Setup

### Prerequisites
- Node.js (latest LTS)
- npm / yarn / pnpm / bun

### Installation

```bash
# npm
npm install

# yarn
yarn install

# pnpm
pnpm install

# bun
bun install

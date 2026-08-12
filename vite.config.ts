// =============================================================================
// Vite Configuration
// =============================================================================
// Vite is the build tool / dev server for the project.
// Think of it like 'uvicorn' for FastAPI — it serves your app during development
// with hot-reload (changes appear instantly without manual refresh).
//
// This config file tells Vite:
//   1. We're using React (via the @vitejs/plugin-react plugin)
//   2. We're using Tailwind CSS v4 (via the @tailwindcss/vite plugin)
// =============================================================================

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

const certPath = path.join(__dirname, 'cert')

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    https: {
      key: fs.existsSync(path.join(certPath, 'server.key')) 
        ? fs.readFileSync(path.join(certPath, 'server.key'))
        : undefined,
      cert: fs.existsSync(path.join(certPath, 'server.crt'))
        ? fs.readFileSync(path.join(certPath, 'server.crt'))
        : undefined,
    }
  }
})
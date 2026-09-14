import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // Needed for the port to be reachable from outside the docker-compose container
    host: true,
  },
  build: {
    outDir: 'build',
  },
});

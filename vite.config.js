import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  // Load environment variables based on current mode (local or production)
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: env.VITE_BASE_PATH || (mode === 'production' ? '/geo-find/' : '/'),
    plugins: [
      react(),
      tailwindcss(),
    ],
  };
});

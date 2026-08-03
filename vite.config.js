import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import obfuscatorPlugin from 'vite-plugin-javascript-obfuscator';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: false, // Ensure source maps are strictly turned OFF
  },
  plugins: [
    react(),
    obfuscatorPlugin({
      compact: true,
      controlFlowFlattening: true, // Scrambles code execution flow
      deadCodeInjection: false,
      stringArray: true,
      stringArrayEncoding: ['base64'], // Encodes all text/strings inside code
      splitStrings: true,
    })    
  ],
});


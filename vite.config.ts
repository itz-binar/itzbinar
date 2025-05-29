import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on mode
  const env = loadEnv(mode, process.cwd(), '');
  
  // Set to true to use development React build for debugging
  const useDevReact = true;
  
  return {
    plugins: [
      react({
        // SWC options
        jsxImportSource: 'react',
        // Development mode is set at the Vite level, not plugin level
      }),
    ],
    // Use development mode to get better error messages
    mode: useDevReact ? 'development' : mode,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@styles': path.resolve(__dirname, './src/styles'),
        '@assets': path.resolve(__dirname, './src/assets'),
        '@hooks': path.resolve(__dirname, './src/hooks'),
        '@utils': path.resolve(__dirname, './src/utils'),
      },
    },
    server: {
      port: 3000,
      open: true,
      cors: true,
    },
    build: {
      sourcemap: true, // Always include sourcemaps for debugging
      minify: useDevReact ? false : 'terser',
      terserOptions: {
        compress: {
          drop_console: !useDevReact && mode === 'production',
          drop_debugger: !useDevReact && mode === 'production',
        },
      },
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'motion': ['framer-motion'],
            'icons': ['lucide-react'],
          },
        },
      },
      chunkSizeWarningLimit: 1000,
    },
    css: {
      devSourcemap: true,
    },
    esbuild: {
      logOverride: { 'this-is-undefined-in-esm': 'silent' },
    },
  };
});
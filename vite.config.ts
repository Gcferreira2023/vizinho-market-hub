
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Usar a sintaxe correta para acessar as variáveis de ambiente no Vite
  define: {
    // Usando hardcoded values para garantir que funcione
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify("https://lqbhtvgpylngscpuqasb.supabase.co"),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxYmh0dmdweWxuZ3NjcHVxYXNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyMTkxNDIsImV4cCI6MjA2MTc5NTE0Mn0.SgGj0eo4k7R0jhjBqnUuZvq2Qh6b9saTIzFx1XJKrTs")
  },
}));

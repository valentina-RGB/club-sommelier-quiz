import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import AuthRoutes from './router';

// Configuración global de React Query para toda la aplicación
// staleTime: Tiempo que los datos se consideran "frescos" (evita refetch innecesarios)
// gcTime: Tiempo que los datos permanecen en caché después de no usarse
// Esto mejora la performance y UX al navegar entre waiting/questions en el quiz
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000, 
      gcTime: 5 * 60 * 1000,    
    },
  },
});

createRoot(document.getElementById('root')!).render(
    // <React.StrictMode>
  <QueryClientProvider client={queryClient}>
    <Toaster  />
    <AuthRoutes />
    {/* <ReactQueryDevtools initialIsOpen={false} /> */}
</QueryClientProvider>
  // </React.StrictMode>
)

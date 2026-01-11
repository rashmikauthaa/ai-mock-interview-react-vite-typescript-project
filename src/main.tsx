import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ToastProvider } from "@/provider/toast-provider"
import { ThemeProvider } from 'next-themes'
import { AuthProvider } from '@/context/auth-context'

import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <App />
        <ToastProvider />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);

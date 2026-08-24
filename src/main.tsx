import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import { TRPCProvider } from "@/providers/trpc"
import { setupCleanConsole } from "@/lib/utils"
import { initSentry } from "@/lib/sentry"
import App from './App.tsx'

// Initialize Sentry error monitoring (no-op if VITE_SENTRY_DSN not set)
initSentry()
setupCleanConsole()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <TRPCProvider>
        <App />
      </TRPCProvider>
    </BrowserRouter>
  </StrictMode>,
)
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppExact from './AppExact.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppExact />
  </StrictMode>,
)

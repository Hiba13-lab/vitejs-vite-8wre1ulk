import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './pack-promos.css'
import './pack-detail.css'
import './product-grid.css'
import './promotion.css'
import './hero-premium.css'
import './payment-premium.css'
import './payment-extra.ts'
import './order-sync.ts'
import './favorites.ts'
import './admin-safe.ts'
import './hero-safe.ts'
import './client-logout.ts'
import AppExact from './AppExact.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppExact />
  </StrictMode>,
)

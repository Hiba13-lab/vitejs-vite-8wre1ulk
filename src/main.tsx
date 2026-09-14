import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './pack-promos.css'
import './pack-detail.css'
import './product-grid.css'
import './promotion.css'
import './hero-premium.css'
import './payment-premium.css'
import './login-cleanup.css'
import './presentation-visual-fixes.css'
import './promo-home-safe.css'
import './admin-premium.css'
import './cart-premium.css'
import './velvet-style.css'

// Scripts fonctionnels gardés volontairement simples et sans observateurs lourds.
import './cart-premium.ts'
import './admin-safe.ts'
import './osrah-final-fixes.ts'
import './client-enhancements.ts'

import AppExact from './AppExact.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppExact />
  </StrictMode>,
)

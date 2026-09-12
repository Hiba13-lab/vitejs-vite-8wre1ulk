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

// Extensions utiles uniquement. Les anciens scripts globaux ont été retirés
// pour éviter les boucles DOM / MutationObserver qui pouvaient figer localhost.
import './product-overrides.ts'
import './payment-extra.ts'
import './promo-home.ts'
import './cart-premium.ts'
import './pack-cart-sync.ts'
import './pack-navigation.ts'

import AppExact from './AppExact.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppExact />
  </StrictMode>,
)

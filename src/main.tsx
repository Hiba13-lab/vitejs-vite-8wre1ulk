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
import './payment-extra.ts'
import './order-sync.ts'
import './favorites.ts'
import './men-page.ts'
import './admin-premium.ts'
import './admin-data-sync.ts'
import './admin-shop-fix.ts'
import './promo-safe.ts'
import './category-art.ts'
import './hero-safe.ts'
import './client-logout.ts'
import './presentation-visual-fixes.ts'
import './promo-home.ts'
import AppExact from './AppExact.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppExact />
  </StrictMode>,
)

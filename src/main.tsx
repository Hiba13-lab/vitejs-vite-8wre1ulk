import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './pack-promos.css'
import './pack-detail.css'
import './product-grid.css'
import './promotion.css'
import './hero-premium.css'
import './payment-premium.css'
import './pack-navigation.ts'
import './site-fixes.ts'
import './men-page.ts'
import './favorites.ts'
import './perfume-page.ts'
import './payment-extra.ts'
import './promotion-everywhere.ts'
import './cart-premium.ts'
import './order-sync.ts'
import './admin-premium.ts'
import './admin-data-sync.ts'
import './client-logout.ts'
import AppExact from './AppExact.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppExact />
  </StrictMode>,
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './pack-promos.css'
import './pack-detail.css'
import './product-grid.css'
import './promotion.css'
import './pack-navigation.ts'
import './site-fixes.ts'
import './men-page.ts'
import './favorites.ts'
import AppExact from './AppExact.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppExact />
  </StrictMode>,
)

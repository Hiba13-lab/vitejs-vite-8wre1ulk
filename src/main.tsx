import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const showCartToast = () => {
  const oldToast = document.querySelector('.cart-success-toast')
  oldToast?.remove()

  const toast = document.createElement('div')
  toast.className = 'cart-success-toast'
  toast.innerHTML = '<span class="cart-success-icon">✓</span><div><strong>Produit ajouté</strong><small>Le produit a bien été ajouté au panier.</small></div>'
  document.body.appendChild(toast)

  requestAnimationFrame(() => toast.classList.add('show'))

  window.setTimeout(() => {
    toast.classList.remove('show')
    window.setTimeout(() => toast.remove(), 250)
  }, 2200)
}

document.addEventListener('click', (event) => {
  const target = event.target as HTMLElement | null
  const button = target?.closest('button')
  if (!button || button.disabled) return

  const label = button.textContent?.trim().toUpperCase() ?? ''
  if (button.classList.contains('add') || label.includes('AJOUTER AU PANIER')) {
    showCartToast()
  }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

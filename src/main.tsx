import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

/* Design tokens */
import './variables.css'

/* Modular styles */
import './styles/global.css'
import './styles/toast.css'
import './styles/favorites.css'
import './styles/profile.css'

/* Context providers */
import { AuthProvider } from './context/AuthContext'
import { FilterProvider } from './context/FilterContext'
import { ModalProvider } from './context/ModalContext'
import { FavoritesProvider } from './context/FavoritesContext'
import { InternshipProvider } from './context/InternshipContext'

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <FilterProvider>
          <FavoritesProvider>
            <InternshipProvider>
              <ModalProvider>
              <App />
            </ModalProvider>
            </InternshipProvider>
          </FavoritesProvider>
        </FilterProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)

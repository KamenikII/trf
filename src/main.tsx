import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { FavoritesPage } from './pages/FavoritesPage'
import { SettingsPage } from './pages/SettingsPage'
import { ProfilePage } from './pages/ProfilePage'

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

const router = createBrowserRouter([
  {
    path: "/*",
    element: <App />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <AuthProvider>
        <FilterProvider>
          <FavoritesProvider>
            <InternshipProvider>
              <ModalProvider>
                <RouterProvider router={router} />
              </ModalProvider>
            </InternshipProvider>
          </FavoritesProvider>
        </FilterProvider>
      </AuthProvider>
  </StrictMode>,
)

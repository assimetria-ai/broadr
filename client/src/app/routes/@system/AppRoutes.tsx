import { Routes, Route } from 'react-router-dom'
import { LandingPage } from '../../pages/static/@system/LandingPage'
import { HomePage } from '../../pages/app/@system/HomePage'
import { NotFoundPage } from '../../pages/static/@system/NotFoundPage'

// @custom routes imported from routes/@custom/index.tsx
import { customRoutes } from '../@custom'

export function AppRoutes() {
  return (
    <Routes>
      {/* Static / marketing */}
      <Route path="/" element={<LandingPage />} />

      {/* App (authenticated) */}
      <Route path="/app" element={<HomePage />} />

      {/* Custom product routes */}
      {customRoutes}

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

import { Route } from 'react-router-dom'
import { BroadrDashboardPage } from '../../pages/app/@custom/BroadrDashboardPage'

export const customRoutes: React.ReactElement[] = [
  <Route key="broadr-dashboard" path="/app/channels" element={<BroadrDashboardPage />} />,
]

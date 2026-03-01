import { Route } from 'react-router-dom'
import { BroadrDashboardPage } from '../../pages/app/@custom/BroadrDashboardPage'
import { ComposePage } from '../../pages/app/@custom/ComposePage'
import { SchedulePage } from '../../pages/app/@custom/SchedulePage'
import { BroadrAnalyticsPage } from '../../pages/app/@custom/BroadrAnalyticsPage'

export const customRoutes: React.ReactElement[] = [
  <Route key="broadr-dashboard" path="/app/channels" element={<BroadrDashboardPage />} />,
  <Route key="broadr-compose" path="/app/compose" element={<ComposePage />} />,
  <Route key="broadr-schedule" path="/app/schedule" element={<SchedulePage />} />,
  <Route key="broadr-analytics" path="/app/analytics" element={<BroadrAnalyticsPage />} />,
]

import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './app/routes/@system/AppRoutes'
import { Toaster } from './app/components/@system/Toast/Toaster'

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <Toaster />
    </BrowserRouter>
  )
}

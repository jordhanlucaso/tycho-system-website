import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './lib/auth'
import { CartProvider } from './lib/cart'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import { AdminLayout } from './components/layout/AdminLayout'
import { Home } from './routes/Home'
import { MockupPage } from './routes/mockups/MockupPage'
import { Checkout } from './routes/Checkout'
import { CheckoutSuccess } from './routes/CheckoutSuccess'
import { CheckoutCancel } from './routes/CheckoutCancel'
import { Login } from './routes/Login'
import { Register } from './routes/Register'
import { AdminOverview } from './routes/admin/Overview'
import { AdminClients } from './routes/admin/Clients'
import { AdminInvoices } from './routes/admin/Invoices'
import { AdminSites } from './routes/admin/Sites'
import { AdminMonitoring } from './routes/admin/Monitoring'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { DashboardOverview } from './routes/dashboard/Overview'
import { DashboardSites } from './routes/dashboard/Sites'
import { DashboardInvoices } from './routes/dashboard/Invoices'
import { DashboardSettings } from './routes/dashboard/Settings'
import { NotFound } from './routes/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/m/:slug' element={<MockupPage />} />
            <Route path='/checkout' element={<Checkout />} />
            <Route path='/checkout/success' element={<CheckoutSuccess />} />
            <Route path='/checkout/cancel' element={<CheckoutCancel />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />

            {/* Admin dashboard */}
            <Route path='/admin' element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<AdminOverview />} />
              <Route path='clients' element={<AdminClients />} />
              <Route path='invoices' element={<AdminInvoices />} />
              <Route path='sites' element={<AdminSites />} />
              <Route path='monitoring' element={<AdminMonitoring />} />
            </Route>

            {/* Client dashboard */}
            <Route path='/dashboard' element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<DashboardOverview />} />
              <Route path='sites' element={<DashboardSites />} />
              <Route path='invoices' element={<DashboardInvoices />} />
              <Route path='settings' element={<DashboardSettings />} />
            </Route>

            <Route path='*' element={<NotFound />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

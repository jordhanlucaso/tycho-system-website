import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './lib/cart'
import { Home } from './routes/Home'
import { MockupPage } from './routes/mockups/MockupPage'
import { Checkout } from './routes/Checkout'
import { NotFound } from './routes/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/m/:slug' element={<MockupPage />} />
          <Route path='/checkout' element={<Checkout />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  )
}

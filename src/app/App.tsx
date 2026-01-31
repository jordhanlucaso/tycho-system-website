import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from './routes/Home'
import { MockupPage } from './routes/mockups/MockupPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/m/:slug' element={<MockupPage />} />
      </Routes>
    </BrowserRouter>
  )
}

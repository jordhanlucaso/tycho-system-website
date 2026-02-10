import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from './app/lib/theme'
import App from './app/App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
)

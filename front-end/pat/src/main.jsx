import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PatProvider } from './context/PatContext.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PatProvider>
    <App />
    </PatProvider>
  </StrictMode>,
)

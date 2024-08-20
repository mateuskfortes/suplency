import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import Pomodoro from './pages/Pomodoro.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Pomodoro />
  </StrictMode>,
)

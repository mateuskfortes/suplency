import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Route, Routes, HashRouter } from "react-router-dom";
import Home from './pages/Home';
import Study from './pages/Study';
import Flashcards from './pages/Flashcards';
import './assets/Default.scss'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="account" element={<Home />}>
          <Route path="login" element={<Home />} />
          <Route path="signup" element={<Home />} />
        </Route>
        <Route path="study" >
          <Route index element={<Study />} />
          <Route path="flashcards" element={<Flashcards />} />
        </Route>
      </Routes>
    </HashRouter>
  </StrictMode>
)

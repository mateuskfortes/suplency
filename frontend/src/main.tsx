import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Route, Routes, HashRouter } from "react-router-dom";
import Home from './pages/Home';
import Study from './pages/Study';
import Flashcards from './pages/Flashcards';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import './assets/Default.scss'

const CustomStrictMode = ({ children }: { children: React.ReactNode }) => {
    return  false 
            ? <StrictMode children={children} />
            : <>{children}</>
}
    

createRoot(document.getElementById('root')!).render(
    <CustomStrictMode>
        <HashRouter 
            future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
            }}>
            <Routes>
                <Route path="/" >
                <Route index element={<Home />} />
                <Route path="account">
                    <Route path="login" element={<Login />} />
                    <Route path="sing-up" element={<SignUp />} />
                </Route>
                <Route path="study" >
                    <Route index element={<Study />} />
                    <Route path="flashcards" element={<Flashcards />} />
                </Route>
                </Route>
            </Routes>
        </HashRouter>
    </CustomStrictMode>
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import Home from './pages/home/Home';
import Study from './pages/study/Study';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Home />}/>
      <Route path='account' element={<Home />}>
        <Route path='login' element={<Home />}/>
        <Route path='singup' element={<Home />}/>
      </Route>
      <Route path='study' element={<Study />}/>
    </>
  )
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

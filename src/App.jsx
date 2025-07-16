// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Preferences from './pages/Preferences'
import AdminPanel from './pages/AdminPanel'
import AdminUsers from './pages/AdminUsers'
import AdminShifts from './pages/AdminShifts'
import AdminResults from './pages/AdminResults'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/preferences/:userId" element={<Preferences />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/shifts" element={<AdminShifts />} />
        <Route path="/admin/results" element={<AdminResults />} />
      </Routes>
    </BrowserRouter>
  )
}

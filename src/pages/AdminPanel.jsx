// src/pages/AdminPanel.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

export default function AdminPanel() {
  const navigate = useNavigate()

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh' }}>
      <h2 className="text-success mb-5">מסך ניהול</h2>

      <div className="w-100 d-flex flex-column gap-3" style={{ maxWidth: '400px' }}>
        <button
          className="btn btn-outline-success btn-lg"
          onClick={() => navigate('/admin/users')}
        >
          לרשימת הלוחמים
        </button>

        <button
          className="btn btn-outline-success btn-lg"
          onClick={() => navigate('/admin/shifts')}
        >
          הגדרת כוננויות
        </button>

        <button
          className="btn btn-outline-success btn-lg"
          onClick={() => navigate('/admin/results')}
        >
          טבלת כוננות
        </button>
      </div>

      <button className="btn btn-secondary mt-5" onClick={() => navigate('/')}>
        חזור
      </button>
    </div>
  )
}

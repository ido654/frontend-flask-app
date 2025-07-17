// src/pages/Home.jsx
import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import '../styles/main.css'
import 'bootstrap/dist/css/bootstrap.min.css'

export default function Home() {
  const API = process.env.REACT_APP_API_URL
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (name.trim().toLowerCase() === 'admin') {
      navigate('/admin')
      return
    }

    try {
      const res = await axios.get(`${API}/users` , {withCredentials: true})
      const users = res.data
      const foundUser = users.find(u => u.name === name.trim())
      if (foundUser) {
        console.log(foundUser)
        navigate(`/preferences/${foundUser.user_id}`)
      } else {
        setError('שם המשתמש לא נמצא')
      }
    } catch (err) {
      setError('שגיאה בשרת')
      console.error(err)
    }
  }

  return (
    <div className="home-container d-flex flex-column justify-content-center align-items-center">
      <h2 className="text-success mb-4">הכנס את שמך</h2>
      <input
        className="form-control text-center mb-3 w-75"
        type="text"
        placeholder="שם משתמש"
        value={name}
        onChange={(e) => {
          setName(e.target.value)
          setError('')
        }}
      />
      {error && <div className="text-danger mb-3">{error}</div>}
      <button className="btn btn-success px-5" onClick={handleSubmit}>המשך</button>
    </div>
  )
}

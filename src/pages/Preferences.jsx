// src/pages/Preferences.jsx
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'


export default function Preferences() {
  const API = process.env.REACT_APP_API_URL
  const { userId } = useParams()
  const navigate = useNavigate()
  const [userName, setUserName] = useState('')
  const [shifts, setShifts] = useState([])
  const [constraints, setConstraints] = useState({})
  const [expandedShiftId, setExpandedShiftId] = useState(null)
  const [error, setError] = useState(null)

  // טען שם משתמש
  useEffect(() => {
    const API = process.env.REACT_APP_API_URL
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API}/users`)
        const user = res.data.find(u => u.user_id === parseInt(userId))
        if (!user) return setError('משתמש לא נמצא')
        setUserName(user.name)
      } catch (err) {
        setError('שגיאה בשרת')
      }
    }
    fetchUser()
  }, [userId])

  // טען משמרות ואילוצים
  useEffect(() => {
    const API = process.env.REACT_APP_API_URL
    const fetchData = async () => {
      try {
        const shiftsRes = await axios.get(`${API}/shifts`)
        const constraintsRes = await axios.get(`${API}/constraints`)

        setShifts(shiftsRes.data)
        const userConstraints = constraintsRes.data.filter(c => c.user_id === parseInt(userId))
        const constraintMap = {}
        userConstraints.forEach(c => {
          constraintMap[c.shift_id] = c.available_key
        })
        setConstraints(constraintMap)
      } catch (err) {
        setError('שגיאה בטעינת הנתונים')
      }
    }
    fetchData()
  }, [userId])

  const getCardClass = (key) => {
    if (key === 1) return 'border-success'
    if (key === 2) return 'border-warning'
    return 'border-danger bg-light'
  }

  const updateKey = (shift_id, key) => {
    setConstraints(prev => ({ ...prev, [shift_id]: key }))
  }

  const handleSave = async () => {
    try {
      await Promise.all(
        Object.entries(constraints).map(([shift_id, key]) =>
          axios.patch(`${API}/constraints/${userId}/${shift_id}`, {
            available_key: key,
          })
        )
      )
      alert('העדפות נשמרו בהצלחה!')
    } catch (err) {
      alert('שגיאה בשמירה')
    }
  }

  return (
    <div className="container py-4">
      <h3 className="text-success mb-4">שלום, {userName}</h3>

      {error && <div className="alert alert-danger">{error}</div>}

      {shifts.map(shift => {
        const key = constraints[shift.shift_id]
        return (
          <div key={shift.shift_id} className={`card mb-3 ${getCardClass(key)}`}>
            <div
              className="card-body"
              onClick={() =>
                setExpandedShiftId(prev => (prev === shift.shift_id ? null : shift.shift_id))
              }
              style={{ cursor: 'pointer' }}
            >
              <h5 className="card-title">
                {shift.start_date} - {shift.end_date}
              </h5>

              {expandedShiftId === shift.shift_id && (
                <div className="mt-4 d-flex justify-content-around gap-2">
                  <button
                    className={`btn btn-outline-success  ${
                      key === 1 ? 'active' : ''
                    }`}
                    onClick={(e) => {
                      e.stopPropagation()
                      updateKey(shift.shift_id, 1)
                    }}
                  >
                    יכול
                  </button>
                  <button
                    className={`btn btn-outline-warning  ${
                      key === 2 ? 'active' : ''
                    }`}
                    onClick={(e) => {
                      e.stopPropagation()
                      updateKey(shift.shift_id, 2)
                    }}
                  >
                    מעדיף שלא
                  </button>
                  <button
                    className={`btn btn-outline-danger  ${
                      key === 0 ? 'active' : ''
                    }`}
                    onClick={(e) => {
                      e.stopPropagation()
                      updateKey(shift.shift_id, 0)
                    }}
                  >
                    חוסם
                  </button>
                </div>
              )}
            </div>
          </div>
        )
      })}

      <div className="d-flex justify-content-between mt-4">
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>חזור</button>
        <button className="btn btn-success" onClick={handleSave}>שמור נתונים</button>
      </div>
    </div>
  )
}

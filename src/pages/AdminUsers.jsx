import React, { useEffect, useState , useCallback } from 'react'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useNavigate } from 'react-router-dom'

export default function AdminUsers() {
  const API = process.env.REACT_APP_API_URL
  const [users, setUsers] = useState([])
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/users/`)
      setUsers(res.data)
    } catch (err) {
      console.error(err)
      setError('שגיאה בשליפת משתמשים')
    }
  }, [API]) // fetchUsers תלוי רק ב-API

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers]) 

  const handleAdd = async () => {
    if (!name.trim()) return setError('נא להזין שם תקין')

    try {
      await axios.post(`${API}/users/`, { name: name.trim() })
      setName('')
      setError('')
      fetchUsers()
    } catch (err) {
      setError('שגיאה בהוספה')
    }
  }

  const handleDelete = async (userId) => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק את המשתמש?')) return

    try {
      await axios.delete(`${API}/users/${userId}`)
      fetchUsers()
    } catch (err) {
      setError('שגיאה במחיקה')
      console.log(err)
    }
  }

  return (
    <div className="container mt-5">
      <h3 className="text-success mb-4">ניהול לוחמים</h3>

      <div className="mb-4 d-flex gap-2">
        <input
          type="text"
          className="form-control w-50"
          placeholder="הכנס שם חדש"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            setError('')
          }}
        />
        <button className="btn btn-success" onClick={handleAdd}>
          הוסף
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <table className="table table-bordered">
        <thead>
          <tr className="table-success text-center">
            <th>שם</th>
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.user_id} className="text-center">
              <td>{user.name}</td>
              <td>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user.user_id)}>
                  מחק
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="btn btn-secondary mt-4" onClick={() => navigate('/admin')}>
        חזור
      </button>
    </div>
  )
}

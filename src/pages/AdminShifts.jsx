import React, { useEffect, useState ,useCallback } from 'react'
import {  useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Button, Table, Form } from 'react-bootstrap'

export default function AdminShifts() {
  const API = process.env.REACT_APP_API_URL
  const navigate = useNavigate()
  const [shifts, setShifts] = useState([])
  const [newShift, setNewShift] = useState({ start_date: '', end_date: '' })
  const [editingId, setEditingId] = useState(null)
  const [editShift, setEditShift] = useState({ start_date: '', end_date: '' })

  

  const fetchShifts = useCallback(async () => {
    const API = process.env.REACT_APP_API_URL
    try {
      const res = await axios.get(`${API}/shifts`)
      setShifts(res.data)
    } catch (err) {
      console.error('Failed to fetch shifts:', err)
    }
  } , [])

  useEffect(() => {
    fetchShifts()
  }, [fetchShifts])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this shift?')) return
    try {
      await axios.delete(`${API}/shifts/${id}`)
      fetchShifts()
    } catch (err) {
      console.error('Failed to delete shift:', err)
    }
  }

  const handleEdit = (shift) => {
    setEditingId(shift.shift_id)
    setEditShift({ start_date: shift.start_date, end_date: shift.end_date })
  }

  const handleEditSave = async () => {
    try {
      await axios.put(`${API}/shifts/${editingId}`, editShift, {
        headers: { 'Content-Type': 'application/json' },
      })
      setEditingId(null)
      fetchShifts()
    } catch (err) {
      console.error('Failed to save shift:', err)
    }
  }

  const handleAddShift = async () => {
    if (!newShift.start_date || !newShift.end_date) return
    try {
      await axios.post(`${API}/shifts`, newShift, {
        headers: { 'Content-Type': 'application/json' },
      })
      setNewShift({ start_date: '', end_date: '' })
      fetchShifts()
    } catch (err) {
      console.error('Failed to add shift:', err)
    }
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-3 text-success">ניהול משמרות</h2>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>תאריך התחלה</th>
            <th>תאריך סיום</th>
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {shifts.map((shift, index) => (
            <tr key={shift.shift_id}>
              <td>{index + 1}</td>
              <td>
                {editingId === shift.shift_id ? (
                  <Form.Control
                    type="text"
                    value={editShift.start_date}
                    onChange={(e) =>
                      setEditShift({ ...editShift, start_date: e.target.value })
                    }
                  />
                ) : (
                  shift.start_date
                )}
              </td>
              <td>
                {editingId === shift.shift_id ? (
                  <Form.Control
                    type="text"
                    value={editShift.end_date}
                    onChange={(e) =>
                      setEditShift({ ...editShift, end_date: e.target.value })
                    }
                  />
                ) : (
                  shift.end_date
                )}
              </td>
              <td>
                {editingId === shift.shift_id ? (
                  <>
                    <Button variant="success" size="sm" onClick={handleEditSave}>
                      שמור
                    </Button>{' '}
                    <Button variant="secondary" size="sm" onClick={() => setEditingId(null)}>
                      ביטול
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="warning" size="sm" onClick={() => handleEdit(shift)}>
                      ערוך
                    </Button>{' '}
                    <Button variant="danger" size="sm" onClick={() => handleDelete(shift.shift_id)}>
                      מחק
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h4 className="mt-4">הוסף משמרת חדשה</h4>
      <Form className="row g-2">
        <div className="col-md-5">
          <Form.Control
            type="text"
            placeholder="תאריך התחלה"
            value={newShift.start_date}
            onChange={(e) => setNewShift({ ...newShift, start_date: e.target.value })}
          />
        </div>
        <div className="col-md-5">
          <Form.Control
            type="text"
            placeholder="תאריך סיום"
            value={newShift.end_date}
            onChange={(e) => setNewShift({ ...newShift, end_date: e.target.value })}
          />
        </div>
        <div className="col-md-2">
          <Button variant="success" onClick={handleAddShift}>
            הוסף משמרת
          </Button>
        </div>
      </Form>
      <div className="d-flex justify-content-between mt-4">
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>חזור</button>
      </div>
    </div>
  )
}

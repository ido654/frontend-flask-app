import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom'

const API = process.env.REACT_APP_API_URL // שנה לפי הצורך

const AdminResults = () => {
  const [results, setResults] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    axios.post(`${API}/run-schedule`)
    axios.get(`${API}/run-schedule`)
      .then(res => {
        setResults(res.data);
      })
      .catch(err => {
        console.error('שגיאה בשליפת נתונים:', err);
      });
  }, []);

  // מציאת המספר המקסימלי של משתמשים בשיבוץ
  const maxUsers = Math.max(...results.map(r => r.users.length), 0);

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-success">טבלת שיבוצים</h2>
      <div className="table-responsive">
        <table className="table table-bordered text-center">
          <thead className="table-success">
            <tr>
              <th>מספר משמרת</th>
              <th>תאריכים</th>
              {[...Array(maxUsers)].map((_, i) => (
                <th key={i}>משתמש {i + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.map((row, idx) => (
              <tr key={idx}>
                <td>{row.shift_id}</td>
                <td>{row.dates}</td>
                {[...Array(maxUsers)].map((_, i) => (
                  <td key={i}>
                    {row.users[i] || '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="d-flex justify-content-between mt-4">
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>חזור</button>
      </div>
    </div>
  );
};

export default AdminResults;

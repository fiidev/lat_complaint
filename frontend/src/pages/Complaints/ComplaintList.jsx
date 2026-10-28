import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { client } from '../../lib/client'

export default function ComplaintList() {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const get = async () => {
    try {
      const res = await client.get('/me/complaints')
      setComplaints(res.data.data)
    } catch {
      setError('Gagal memuat aduan')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    get()
  }, [])

  const badgeColor = {
    submitted: 'badge-warning',
    accepted: 'badge-info',
    rejected: 'badge-danger',
    in_progress: 'badge-info',
    resolved: 'badge-success',
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Aduan Saya</h3>
        <Link to="/complaints/create" className="btn btn-primary btn-sm">
          + Buat Aduan
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <p>Loading...</p>
      ) : complaints.length === 0 ? (
        <p>Belum ada aduan</p>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>No</th>
                <th>Judul</th>
                <th>Ruangan</th>
                <th>Kategori</th>
                <th>Tanggal</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c, i) => (
                <tr key={c.id}>
                  <td>{i + 1}</td>
                  <td><strong>{c.title}</strong></td>
                  <td>{c.room?.name || '-'}</td>
                  <td>{c.category?.name || '-'}</td>
                  <td>{c.created_at ? c.created_at.split('T')[0] : '-'}</td>
                  <td>
                    <span className={`badge ${badgeColor[c.status] || 'badge-secondary'}`}>
                      {c.status}
                    </span>
                  </td>
                  <td>
                    <Link to={`/complaints/${c.id}`} className="btn btn-sm btn-secondary">
                      Detail
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

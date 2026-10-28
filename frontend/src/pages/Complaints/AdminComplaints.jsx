import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { client } from '../../lib/client'

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const get = async () => {
    try {
      const res = await client.get('/admin/complaints')
      setComplaints(res.data.data)
    } catch {
      setError('Gagal memuat pengaduan')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    get()
  }, [])

  const accept = async (id) => {
    if (!confirm('Terima aduan ini?')) return
    try {
      await client.patch(`/admin/complaints/${id}/accept`)
      setComplaints((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: 'accepted' } : c))
      )
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menerima aduan')
    }
  }

  const reject = async (id) => {
    const reason = prompt('Alasan penolakan:')
    if (!reason) return
    try {
      await client.patch(`/admin/complaints/${id}/reject`, { rejection_reason: reason })
      setComplaints((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: 'rejected', rejection_reason: reason } : c))
      )
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menolak aduan')
    }
  }

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
        <h3 className="card-title">Daftar Pengaduan Masuk</h3>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Pelapor</th>
                <th>Ruangan</th>
                <th>Aduan</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c) => (
                <tr key={c.id}>
                  <td>#{c.id}</td>
                  <td>
                    <strong>{c.user?.name || '-'}</strong>
                    <br />
                    <small style={{ color: '#64748b' }}>{c.user?.role}</small>
                  </td>
                  <td>{c.room?.name || '-'}</td>
                  <td>
                    <strong>{c.title}</strong>
                    <br />
                    <small style={{ color: '#64748b' }}>{c.category?.name || '-'}</small>
                  </td>
                  <td>
                    <span className={`badge ${badgeColor[c.status] || 'badge-secondary'}`}>
                      {c.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                      <Link to={`/complaints/${c.id}`} className="btn btn-sm btn-secondary">
                        Detail
                      </Link>

                      {c.status === 'submitted' && (
                        <>
                          <button onClick={() => accept(c.id)} className="btn btn-sm btn-success">
                            Terima
                          </button>
                          <button onClick={() => reject(c.id)} className="btn btn-sm btn-danger">
                            Tolak
                          </button>
                        </>
                      )}

                      {c.status === 'accepted' && !c.ticket && (
                        <Link to={`/complaints/${c.id}/create-ticket`} className="btn btn-sm btn-primary">
                          Tugaskan Tiket
                        </Link>
                      )}

                      {c.ticket && (
                        <Link to={`/tickets/${c.ticket.id}`} className="btn btn-sm btn-info">
                          Lihat Tiket
                        </Link>
                      )}
                    </div>
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

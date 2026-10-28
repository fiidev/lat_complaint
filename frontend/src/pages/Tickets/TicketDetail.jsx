import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { client } from '../../lib/client'

export default function TicketDetail() {
  const { id } = useParams()
  const [ticket, setTicket] = useState(null)
  const [histories, setHistories] = useState([])
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [savingNote, setSavingNote] = useState(false)

  const get = async () => {
    try {
      const res = await client.get(`/tickets/${id}`)
      setTicket(res.data.data)
      setHistories(res.data.data.histories || [])
    } catch {
      setError('Gagal memuat detail tiket')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    get()
  }, [id])

  const start = async () => {
    if (!confirm('Mulai pengerjaan tiket ini?')) return
    try {
      await client.patch(`/tickets/${id}/start`)
      get()
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal memulai')
    }
  }

  const resolve = async () => {
    const resolution = prompt('Catatan penyelesaian:')
    if (!resolution) return
    try {
      await client.patch(`/tickets/${id}/resolve`, { resolution_notes: resolution })
      get()
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menyelesaikan tiket')
    }
  }

  const addNote = async (e) => {
    e.preventDefault()
    if (!note.trim()) return
    setSavingNote(true)
    try {
      await client.post(`/tickets/${id}/histories`, { note })
      setNote('')
      get()
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menambah catatan')
    } finally {
      setSavingNote(false)
    }
  }

  const badgeStatus = {
    open: 'badge-warning',
    in_progress: 'badge-info',
    resolved: 'badge-success',
  }

  if (loading) return <p>Loading...</p>
  if (error) return <div className="alert alert-danger">{error}</div>
  if (!ticket) return <p>Tiket tidak ditemukan</p>

  const role = localStorage.getItem('role')
  const backUrl = role === 'staff' ? '/tickets' : '/admin/complaints'

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Tiket #{ticket.ticket_number}</h3>
          <Link to={backUrl} className="btn btn-secondary btn-sm">
            Kembali
          </Link>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <p><strong>Aduan:</strong> {ticket.complaint?.title}</p>
          <p><strong>Ruangan:</strong> {ticket.complaint?.room?.name} ({ticket.complaint?.room?.building})</p>
          <p><strong>Kategori:</strong> {ticket.complaint?.category?.name}</p>
          <p>
            <strong>Status:</strong>{' '}
            <span className={`badge ${badgeStatus[ticket.status] || 'badge-secondary'}`}>
              {ticket.status}
            </span>
          </p>
          <p><strong>Teknisi:</strong> {ticket.assignee?.name || '-'}</p>

          <div style={{ marginTop: '0.75rem' }}>
            <label><strong>Deskripsi Kerusakan:</strong></label>
            <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0', marginTop: '0.25rem' }}>
              {ticket.complaint?.description}
            </div>
          </div>

          {ticket.resolution_notes && (
            <div className="alert alert-success" style={{ marginTop: '1rem' }}>
              <strong>Catatan Penyelesaian:</strong> {ticket.resolution_notes}
            </div>
          )}
        </div>

        {role === 'staff' && (
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
            {ticket.status === 'open' && (
              <button onClick={start} className="btn btn-primary">
                Mulai Kerjakan
              </button>
            )}
            {ticket.status === 'in_progress' && (
              <button onClick={resolve} className="btn btn-success">
                Selesai (Resolve)
              </button>
            )}
          </div>
        )}

        <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', marginBottom: '1.5rem' }} />

        <h4 style={{ marginBottom: '0.75rem', color: '#1e293b' }}>Riwayat Progres</h4>
        <div className="table-responsive" style={{ marginBottom: '1.5rem' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Waktu</th>
                <th>Oleh</th>
                <th>Status</th>
                <th>Catatan</th>
              </tr>
            </thead>
            <tbody>
              {histories.map((h) => (
                <tr key={h.id}>
                  <td>{h.created_at ? h.created_at.replace('T', ' ').slice(0, 16) : '-'}</td>
                  <td>{h.user?.name || '-'}</td>
                  <td>
                    {h.new_status ? (
                      <span className={`badge ${badgeStatus[h.new_status] || 'badge-secondary'}`}>
                        {h.new_status}
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>{h.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {ticket.status !== 'resolved' && (
          <form onSubmit={addNote}>
            <div className="form-group">
              <label htmlFor="note">Tambah Catatan Progres</label>
              <textarea
                id="note"
                name="note"
                className="form-control"
                rows={2}
                placeholder="Tulis tindakan yang baru dilakukan..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-secondary btn-sm" disabled={savingNote}>
              {savingNote ? 'Menyimpan...' : 'Kirim Catatan'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

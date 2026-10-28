import { useEffect, useState } from 'react'
import { client } from '../../lib/client'

export default function ReportDashboard() {
  const [filter, setFilter] = useState({
    start_date: '2026-01-01',
    end_date: '2026-12-31',
  })
  const [summary, setSummary] = useState(null)
  const [resolution, setResolution] = useState(null)
  const [categories, setCategories] = useState([])
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const get = async () => {
    setLoading(true)
    setError('')
    try {
      const [resSummary, resCat, resRoom, resRes] = await Promise.all([
        client.get('/admin/reports/complaints/summary', { params: filter }),
        client.get('/admin/reports/complaints/by-category', { params: filter }),
        client.get('/admin/reports/complaints/by-room', { params: filter }),
        client.get('/admin/reports/tickets/resolution', { params: filter }),
      ])
      setSummary(resSummary.data.data)
      setCategories(resCat.data.data || [])
      setRooms(resRoom.data.data || [])
      setResolution(resRes.data.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat laporan')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    get()
  }, [])

  const submit = (e) => {
    e.preventDefault()
    get()
  }

  return (
    <div>
      <div className="card" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
        <form onSubmit={submit} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="start_date">Dari Tanggal</label>
            <input
              type="date"
              id="start_date"
              name="start_date"
              className="form-control"
              value={filter.start_date}
              onChange={(e) => setFilter({ ...filter, start_date: e.target.value })}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="end_date">Sampai Tanggal</label>
            <input
              type="date"
              id="end_date"
              name="end_date"
              className="form-control"
              value={filter.end_date}
              onChange={(e) => setFilter({ ...filter, end_date: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Memuat...' : 'Filter'}
          </button>
        </form>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="grid-3">
        <div className="stat-card">
          <h3>Total Aduan</h3>
          <div className="stat-value">{summary?.total_complaints || 0}</div>
        </div>
        <div className="stat-card">
          <h3>Tiket Berjalan</h3>
          <div className="stat-value">{summary?.tickets?.in_progress || 0}</div>
        </div>
        <div className="stat-card">
          <h3>Tiket Selesai</h3>
          <div className="stat-value">{summary?.tickets?.resolved || 0}</div>
        </div>
        <div className="stat-card">
          <h3>Rata-rata Waktu Solusi</h3>
          <div className="stat-value">{resolution?.metrics?.avg_resolution_time_hours || 0} jam</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Aduan per Kategori</h3>
        </div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>No</th>
                <th>Kategori</th>
                <th>Jumlah Kasus</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c, i) => (
                <tr key={c.id}>
                  <td>{i + 1}</td>
                  <td><strong>{c.name}</strong></td>
                  <td>{c.complaints_count || 0} aduan</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Aduan per Ruangan</h3>
        </div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>No</th>
                <th>Ruangan</th>
                <th>Gedung</th>
                <th>Jumlah Kasus</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((r, i) => (
                <tr key={r.id}>
                  <td>{i + 1}</td>
                  <td><strong>{r.name}</strong></td>
                  <td>{r.building} ({r.room_number})</td>
                  <td>{r.complaints_count || 0} aduan</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

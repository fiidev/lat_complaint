import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { client } from '../lib/client'

export default function Layout() {
  const navigate = useNavigate()
  const role = localStorage.getItem('role')
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const logout = async () => {
    try {
      await client.post('/auth/logout')
    } catch {
      // lanjut clear local storage
    } finally {
      localStorage.clear()
      navigate('/login')
    }
  }

  return (
    <div>
      <nav className="top-bar">
        <h2>Pengaduan Sarpras</h2>
        <div className="nav-links">
          {role === 'admin' && (
            <>
              <NavLink to="/admin/complaints">Pengaduan</NavLink>
              <NavLink to="/rooms">Ruangan</NavLink>
              <NavLink to="/categories">Kategori</NavLink>
              <NavLink to="/reports">Laporan</NavLink>
            </>
          )}

          {role === 'staff' && (
            <NavLink to="/tickets">Tiket Saya</NavLink>
          )}

          {(role === 'student' || role === 'teacher' || role === 'user') && (
            <>
              <NavLink to="/complaints">Aduan Saya</NavLink>
              <NavLink to="/complaints/create">Buat Aduan</NavLink>
            </>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: '1rem' }}>
            {user.name && <span style={{ fontSize: '0.85rem' }}>{user.name}</span>}
            <button onClick={logout} className="btn btn-sm btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="container" style={{ marginTop: '2rem' }}>
        <Outlet />
      </main>
    </div>
  )
}

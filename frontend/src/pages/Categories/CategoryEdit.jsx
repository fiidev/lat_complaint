import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { client } from '../../lib/client'

export default function CategoryEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    const get = async () => {
      try {
        const res = await client.get(`/complaint-categories/${id}`)
        const item = res.data.data
        if (item) setForm(item)
      } catch {
        setError('Gagal memuat kategori')
      } finally {
        setFetching(false)
      }
    }
    get()
  }, [id])

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await client.put(`/complaint-categories/${id}`, form)
      navigate('/categories')
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal update kategori')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return <p>Loading...</p>

  return (
    <div className="container-sm">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Edit Kategori</h3>
          <Link to="/categories" className="btn btn-secondary btn-sm">
            Kembali
          </Link>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={submit}>
          <div className="form-group">
            <label htmlFor="name">Nama Kategori</label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-control"
              value={form.name}
              onChange={change}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading} style={{ marginTop: '1.5rem' }}>
            {loading ? 'Menyimpan...' : 'Update'}
          </button>
        </form>
      </div>
    </div>
  )
}

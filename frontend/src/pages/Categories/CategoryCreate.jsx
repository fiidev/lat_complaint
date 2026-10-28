import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { client } from "../../lib/client";

export default function CategoryCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await client.post("/complaint-categories", form);
      navigate("/categories");
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menyimpan kategori");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-sm">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Tambah Kategori</h3>
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
              placeholder="Contoh: Kelistrikan"
              value={form.name}
              onChange={change}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
            style={{ marginTop: "1.5rem" }}
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </form>
      </div>
    </div>
  );
}

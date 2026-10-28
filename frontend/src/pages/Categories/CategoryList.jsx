import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { client } from "../../lib/client";

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const get = async () => {
    try {
      const res = await client.get("/complaint-categories");
      setCategories(res.data.data);
    } catch {
      setError("Gagal memuat kategori");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    get();
  }, []);

  const del = async (id) => {
    if (!confirm("Hapus kategori ini?")) return;
    try {
      await client.delete(`/complaint-categories/${id}`);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menghapus");
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Kategori Kerusakan</h3>
        <Link to="/categories/create" className="btn btn-primary btn-sm">
          + Tambah Kategori
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Kategori</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c, i) => (
                <tr key={c.id}>
                  <td>{i + 1}</td>
                  <td>
                    <strong>{c.name}</strong>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "0.35rem" }}>
                      <Link
                        to={`/categories/${c.id}/edit`}
                        className="btn btn-sm btn-secondary"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => del(c.id)}
                        className="btn btn-sm btn-danger"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

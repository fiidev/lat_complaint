import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { client } from "../../lib/client";

export default function ComplaintCreate() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: "",
    room_id: "",
    category_id: "",
    description: "",
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([client.get("/rooms"), client.get("/complaint-categories")])
      .then(([resRooms, resCats]) => {
        setRooms(resRooms.data.data);
        setCategories(resCats.data.data);
      })
      .catch(() => setError("Gagal memuat pilihan ruangan atau kategori"));
  }, []);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = new FormData();
    payload.append("title", form.title);
    payload.append("room_id", form.room_id);
    payload.append("category_id", form.category_id);
    payload.append("description", form.description);
    if (file) {
      payload.append("evidence_image", file);
    }

    try {
      await client.post("/complaints", payload);
      navigate("/complaints");
    } catch (err) {
      setError(err.response?.data?.message || "Gagal mengirim aduan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-sm">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Buat Aduan</h3>
          <Link to="/complaints" className="btn btn-secondary btn-sm">
            Kembali
          </Link>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={submit}>
          <div className="form-group">
            <label htmlFor="title">Judul Aduan</label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-control"
              placeholder="Contoh: Lampu Ruang Kelas Mati"
              value={form.title}
              onChange={change}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="room_id">Ruangan</label>
            <select
              id="room_id"
              name="room_id"
              className="form-control"
              value={form.room_id}
              onChange={change}
              required
            >
              <option value="">-- Pilih Ruangan --</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.building})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="category_id">Kategori</label>
            <select
              id="category_id"
              name="category_id"
              className="form-control"
              value={form.category_id}
              onChange={change}
              required
            >
              <option value="">-- Pilih Kategori --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Deskripsi</label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              rows={3}
              placeholder="Tulis detail kerusakannya..."
              value={form.description}
              onChange={change}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="evidence_image">Foto Bukti (Opsional)</label>
            <input
              type="file"
              id="evidence_image"
              name="evidence_image"
              className="form-control"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0] || null)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
            style={{ marginTop: "1.5rem" }}
          >
            {loading ? "Mengirim..." : "Kirim"}
          </button>
        </form>
      </div>
    </div>
  );
}

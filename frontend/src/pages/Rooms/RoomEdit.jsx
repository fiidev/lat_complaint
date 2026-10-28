import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { client } from "../../lib/client";

export default function RoomEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    building: "",
    room_number: "",
    is_active: true,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const get = async () => {
      try {
        const res = await client.get(`/rooms/${id}`);
        const item = res.data.data;
        if (item) setForm(item);
      } catch (err) {
        setError(err.response?.data?.message || "Gagal memuat data");
      } finally {
        setFetching(false);
      }
    };
    get();
  }, [id]);

  const change = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await client.put(`/rooms/${id}`, form);
      navigate("/rooms");
    } catch (err) {
      setError(err.response?.data?.message || "Gagal update data");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <p>Loading...</p>;

  return (
    <div className="container-sm">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Edit Ruangan</h3>
          <Link to="/rooms" className="btn btn-secondary btn-sm">
            Kembali
          </Link>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={submit}>
          <div className="form-group">
            <label htmlFor="name">Nama Ruangan</label>
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

          <div className="form-group">
            <label htmlFor="building">Gedung</label>
            <input
              type="text"
              id="building"
              name="building"
              className="form-control"
              value={form.building}
              onChange={change}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="room_number">Nomor Ruangan</label>
            <input
              type="text"
              id="room_number"
              name="room_number"
              className="form-control"
              value={form.room_number}
              onChange={change}
              required
            />
          </div>

          <div
            className="form-group"
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={Boolean(form.is_active)}
              onChange={change}
            />
            <label htmlFor="is_active" style={{ marginBottom: 0 }}>
              Ruangan Aktif
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
            style={{ marginTop: "1.5rem" }}
          >
            {loading ? "Menyimpan..." : "Update"}
          </button>
        </form>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { client } from "../../lib/client";

export default function TicketCreate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [staffList, setStaffList] = useState([]);
  const [form, setForm] = useState({
    assigned_to: "",
    priority: "medium",
    note: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([client.get(`/complaints/${id}`), client.get("/admin/users")])
      .then(([resComp, resUsers]) => {
        setComplaint(resComp.data.data);
        const staff = (resUsers.data.data || []).filter(
          (u) => u.role === "staff",
        );
        setStaffList(staff);
      })
      .catch(() => setError("Gagal memuat data"));
  }, [id]);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await client.post(`/admin/complaints/${id}/tickets`, form);
      navigate("/admin/complaints");
    } catch (err) {
      setError(err.response?.data?.message || "Gagal membuat tiket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-sm">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Tugaskan Tiket</h3>
          <Link to="/admin/complaints" className="btn btn-secondary btn-sm">
            Kembali
          </Link>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {complaint?.ticket && (
          <div className="alert alert-danger">
            Tiket untuk pengaduan ini sudah pernah dibuat (#
            {complaint.ticket.ticket_number}). Tidak bisa membuat tiket ganda.
          </div>
        )}

        {complaint && (
          <div
            style={{
              background: "#f8fafc",
              padding: "0.75rem",
              borderRadius: "6px",
              border: "1px solid #e2e8f0",
              marginBottom: "1.25rem",
            }}
          >
            <p>
              <strong>Aduan #{complaint.id}:</strong> {complaint.title}
            </p>
            <p>
              <strong>Ruangan:</strong> {complaint.room?.name} (
              {complaint.room?.building})
            </p>
          </div>
        )}

        {!complaint?.ticket && (
          <form onSubmit={submit}>
            <div className="form-group">
              <label htmlFor="assigned_to">Pilih Teknisi</label>
              <select
                id="assigned_to"
                name="assigned_to"
                className="form-control"
                value={form.assigned_to}
                onChange={change}
                required
              >
                <option value="">-- Pilih Teknisi --</option>
                {staffList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="priority">Prioritas</label>
              <select
                id="priority"
                name="priority"
                className="form-control"
                value={form.priority}
                onChange={change}
                required
              >
                <option value="low">Rendah</option>
                <option value="medium">Sedang</option>
                <option value="high">Tinggi</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="note">Catatan Tambahan (Opsional)</label>
              <textarea
                id="note"
                name="note"
                className="form-control"
                rows={3}
                placeholder="Instruksi pengerjaan..."
                value={form.note}
                onChange={change}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={loading}
              style={{ marginTop: "1.5rem" }}
            >
              {loading ? "Menyimpan..." : "Buat Tiket"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

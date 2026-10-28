import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { client } from "../../lib/client";

export default function ComplaintDetail() {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const get = async () => {
      try {
        const res = await client.get(`/complaints/${id}`);
        setComplaint(res.data.data);
      } catch {
        setError("Gagal memuat detail aduan");
      } finally {
        setLoading(false);
      }
    };
    get();
  }, [id]);

  const badgeColor = {
    submitted: "badge-warning",
    accepted: "badge-info",
    rejected: "badge-danger",
    in_progress: "badge-info",
    resolved: "badge-success",
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!complaint) return <p>Aduan tidak ditemukan</p>;

  const role = localStorage.getItem("role");
  const backUrl = role === "admin" ? "/admin/complaints" : "/complaints";

  return (
    <div className="container-sm">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Detail Aduan #{complaint.id}</h3>
          <Link to={backUrl} className="btn btn-secondary btn-sm">
            Kembali
          </Link>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <h4
            style={{
              fontSize: "1.15rem",
              color: "#1e293b",
              marginBottom: "0.5rem",
            }}
          >
            {complaint.title}
          </h4>
          <p>
            <strong>Ruangan:</strong> {complaint.room?.name} (
            {complaint.room?.building})
          </p>
          <p>
            <strong>Kategori:</strong> {complaint.category?.name}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={`badge ${badgeColor[complaint.status] || "badge-secondary"}`}
            >
              {complaint.status}
            </span>
          </p>
          <p>
            <strong>Tanggal:</strong> {complaint.created_at?.split("T")[0]}
          </p>
        </div>

        {complaint.status === "rejected" && complaint.rejection_reason && (
          <div className="alert alert-danger" style={{ marginTop: "0.75rem" }}>
            <strong>Alasan Ditolak:</strong> {complaint.rejection_reason}
          </div>
        )}

        <div className="form-group" style={{ marginTop: "1rem" }}>
          <label>
            <strong>Deskripsi Kerusakan:</strong>
          </label>
          <div
            style={{
              background: "#f8fafc",
              padding: "0.75rem",
              borderRadius: "6px",
              border: "1px solid #e2e8f0",
              marginTop: "0.25rem",
            }}
          >
            {complaint.description}
          </div>
        </div>

        {complaint.evidence_image && (
          <div className="form-group" style={{ marginTop: "1rem" }}>
            <label>
              <strong>Foto Bukti:</strong>
            </label>
            <div style={{ marginTop: "0.5rem" }}>
              <img
                src={`http://127.0.0.1:8001/storage/${complaint.evidence_image}`}
                alt="Bukti Pengaduan"
                style={{
                  maxWidth: "100%",
                  borderRadius: "6px",
                  border: "1px solid #e2e8f0",
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

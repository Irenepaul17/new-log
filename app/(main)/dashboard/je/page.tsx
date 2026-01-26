"use client";

import { useGlobal } from "@/app/context/GlobalContext";
import { useRouter } from "next/navigation";

export default function JEDashboard() {
    const { currentUser, reports, complaints } = useGlobal();
    const router = useRouter();

    // Filter reports/complaints for current JE
    const myReports = reports.filter(r => r.authorId === currentUser?.id);
    const myComplaints = complaints.filter(c => c.authorId === currentUser?.id || c.supervisorId === currentUser?.id);

    return (
        <div className="screen active" style={{ display: "block" }}>
            <div className="card">
                <div
                    className="section-title"
                    style={{ justifyContent: "space-between" }}
                >
                    My Work Reports
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={() => router.push('/work-report')}
                    >
                        + START LOG BOOK
                    </button>
                </div>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Description</th>
                                <th>Technician</th>
                                <th>Photos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myReports.length > 0 ? myReports.map((r) => (
                                <tr key={r.id}>
                                    <td>{r.date}</td>
                                    <td>{r.classification.toUpperCase()}</td>
                                    <td>{currentUser?.name}</td>
                                    <td>
                                        <span className="badge" style={{
                                            backgroundColor: r.attachments && r.attachments.length > 0 ? '#10b981' : '#e5e7eb',
                                            color: r.attachments && r.attachments.length > 0 ? 'white' : '#6b7280'
                                        }}>
                                            {r.attachments ? r.attachments.length : 0} {r.attachments && r.attachments.length === 1 ? 'FILE' : 'FILES'}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--muted)' }}>No reports found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="card">
                <div className="section-title">
                    My Failure Reports (Complaints)
                </div>
                <div className="alert alert-info" style={{ marginBottom: '20px', fontSize: '13px' }}>
                    💡 Complaints are automatically generated when you report ANY failure (except "No Failures" status).
                </div>
                <div id="je-complaints-container">
                    {myComplaints.length > 0 ? myComplaints.map(c => (
                        <div key={c.id} style={{
                            border: "1px solid var(--border)",
                            borderRadius: "var(--radius-md)",
                            padding: "24px",
                            marginBottom: "20px",
                            borderColor: c.status === 'Open' ? 'var(--primary)' : '#10b981',
                            background: c.status === 'Open' ? 'var(--primary-soft)' : '#f0fdf4'
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: "18px" }}>Failure Report #{c.id}</div>
                                    <div style={{ color: "var(--muted)", fontSize: "14px" }}>Reported on: {c.date}</div>
                                </div>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    {c.status === 'Open' && <span className="badge" style={{ backgroundColor: '#ef4444', color: 'white' }}>NEW</span>}
                                    <span className={`badge badge-${c.status.toLowerCase().replace(' ', '-')}`}>{c.status}</span>
                                </div>
                            </div>
                            <div style={{ marginBottom: "16px" }}>
                                <div style={{ fontSize: "12px", color: "var(--muted)", textTransform: "uppercase", fontWeight: 600, marginBottom: "4px" }}>Failure Details</div>
                                <div style={{ fontSize: "15px", fontWeight: 500 }}>{c.description}</div>
                            </div>
                            <div style={{ display: "flex", gap: "12px", fontSize: "13px", color: "var(--muted)", paddingTop: "16px", borderTop: "1px solid rgba(0,0,0,0.05)" }}>
                                <div>Category: <span style={{ fontWeight: 600, color: "var(--text)" }}>{c.category}</span></div>
                                <div>•</div>
                                <div>Assigned to: <span style={{ fontWeight: 600, color: "var(--text)" }}>Superior</span></div>
                            </div>
                            {c.status === 'Closed' && (
                                <div style={{ marginTop: '12px', color: '#065f46', fontSize: '13px', fontWeight: 600 }}>
                                    ✅ Resolved by {c.resolvedBy} on {c.resolvedDate}
                                </div>
                            )}
                        </div>
                    )) : (
                        <div style={{ color: 'var(--muted)', padding: '20px', textAlign: 'center' }}>
                            No failure reports yet. Failures with "Yes & Booked" status will appear here.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

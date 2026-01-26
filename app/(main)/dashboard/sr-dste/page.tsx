"use client";

import { useGlobal } from "@/app/context/GlobalContext";

export default function SrDSTEDashboard() {
    const { currentUser, reports, complaints, resolveComplaint } = useGlobal();

    if (!currentUser) return null;

    // Sr. DSTE sees absolutely everything
    const allReports = reports;
    const allComplaints = complaints;

    return (
        <div className="screen active" style={{ display: "block" }}>
            <div className="alert alert-danger">
                <strong>SR. DSTE ({currentUser.name}) AUTHORITY:</strong> Complete system oversight.
            </div>

            <div className="card">
                <div className="section-title">All System Reports</div>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr><th>Date</th><th>Author</th><th>Work</th><th>Station</th></tr>
                        </thead>
                        <tbody>
                            {allReports.map((r) => (
                                <tr key={r.id}>
                                    <td>{r.date}</td>
                                    <td>{r.authorName}</td>
                                    <td>{r.classification.toUpperCase()}</td>
                                    <td>{r.station}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="card">
                <div className="section-title">All Failure Reports (Complaints)</div>
                <div className="alert alert-info" style={{ marginBottom: '20px', fontSize: '13px' }}>
                    💡 Complaints are automatically generated from failure reports across the entire system. You can resolve any complaint.
                </div>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr><th>ID</th><th>Status</th><th>Raised By</th><th>Issue</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            {allComplaints.length > 0 ? allComplaints.map((c) => (
                                <tr key={c.id}>
                                    <td>{c.id}</td>
                                    <td><span className={`badge badge-${c.status.toLowerCase().replace(' ', '-')}`}>{c.status}</span></td>
                                    <td>{c.authorName}</td>
                                    <td>{c.description}</td>
                                    <td>
                                        {c.status === 'Open' && (
                                            <button className="btn btn-primary btn-sm" onClick={() => resolveComplaint(c.id)}>Resolve</button>
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--muted)' }}>No failure reports yet.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

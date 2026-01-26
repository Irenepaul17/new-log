"use client";

import { useGlobal } from "@/app/context/GlobalContext";

export default function ADSTEDashboard() {
    const { currentUser, reports, complaints, resolveComplaint, isSuperiorOf } = useGlobal();

    if (!currentUser) return null;

    // ADSTE sees SSE, JE, Techs in their chain
    const myReports = reports.filter(r => r.authorId === currentUser.id || isSuperiorOf(currentUser, r.authorId));
    const teamComplaints = complaints.filter(c => isSuperiorOf(currentUser, c.authorId) || c.supervisorId === currentUser.id);

    return (
        <div className="screen active" style={{ display: "block" }}>
            <div className="alert alert-warning">
                <strong>ADSTE ({currentUser.name}) AUTHORITY:</strong> Responsible for SSEs, JEs, and Technicians in your team.
            </div>

            <div className="card">
                <div className="section-title">Team Hierarchy Reports</div>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr><th>Date</th><th>Author</th><th>Work</th><th>Station</th></tr>
                        </thead>
                        <tbody>
                            {myReports.map((r) => (
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
                <div className="section-title">Team Failure Reports (Complaints)</div>
                <div className="alert alert-info" style={{ marginBottom: '20px', fontSize: '13px' }}>
                    💡 Complaints are automatically generated from failure reports. You can resolve any complaint from your teams.
                </div>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr><th>ID</th><th>Status</th><th>Raised By</th><th>Issue</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            {teamComplaints.length > 0 ? teamComplaints.map((c) => (
                                <tr key={c.id}>
                                    <td>{c.id}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            {c.status === 'Open' && <span className="badge" style={{ backgroundColor: '#ef4444', color: 'white', fontSize: '10px' }}>NEW</span>}
                                            <span className={`badge badge-${c.status.toLowerCase().replace(' ', '-')}`}>{c.status}</span>
                                        </div>
                                    </td>
                                    <td>{c.authorName}</td>
                                    <td>{c.description}</td>
                                    <td>
                                        {c.status === 'Open' && (
                                            <button className="btn btn-primary btn-sm" onClick={() => resolveComplaint(c.id)}>Resolve</button>
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--muted)' }}>No team failure reports yet.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

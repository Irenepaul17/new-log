"use client";

import { useGlobal } from "@/app/context/GlobalContext";
import { useState, useEffect } from "react";
import { ResolutionModal } from "@/app/components/ResolutionModal";
import WorkReportDetailModal from "@/app/components/WorkReportDetailModal";
import ComplaintDetailModal from "@/app/components/ComplaintDetailModal";
import { Complaint, WorkReport } from "@/app/types";
import { usePaginatedData } from '@/app/hooks/usePaginatedData';
import { PaginationControls } from '@/app/components/PaginationControls';

import AssetSelectionModal from "@/app/components/AssetSelectionModal";

export default function SSEDashboard() {
    const { currentUser, resolveComplaint } = useGlobal(); // Removed reports/complaints from global
    const [resolvingComplaint, setResolvingComplaint] = useState<Complaint | null>(null);
    const [viewingReport, setViewingReport] = useState<WorkReport | null>(null);
    const [viewingComplaint, setViewingComplaint] = useState<Complaint | null>(null);
    const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
    const [assetStats, setAssetStats] = useState({ ei: 0, points: 0, signals: 0, trackCircuits: 0 });

    useEffect(() => {
        fetch('/api/assets/stats')
            .then(res => res.json())
            .then(data => {
                setAssetStats(prev => ({ ...prev, ...data }));
            })
            .catch(err => console.error("Failed to load asset stats", err));
    }, []);

    // Fetch Paginated Reports
    const {
        data: myReports,
        loading: reportsLoading,
        page: reportsPage,
        setPage: setReportsPage,
        meta: reportsMeta
    } = usePaginatedData<WorkReport>(
        '/api/work-reports',
        { userId: currentUser?.id || '', role: currentUser?.role || '' },
        10,
        !!currentUser // enabled
    );

    // Fetch Paginated Complaints
    const {
        data: myComplaints,
        loading: complaintsLoading,
        page: complaintsPage,
        setPage: setComplaintsPage,
        meta: complaintsMeta,
        refresh: refreshComplaints
    } = usePaginatedData<Complaint>(
        '/api/complaints',
        { userId: currentUser?.id || '', role: currentUser?.role || '' },
        10,
        !!currentUser // enabled
    );

    if (!currentUser) return null;

    return (
        <div className="screen active" style={{ display: "block" }}>
            <div className="alert alert-info">
                <strong>SSE ({currentUser.name}) DASHBOARD:</strong> Authority over JE & Technicians in your section.
            </div>

            {/* Asset Stats Dashboard */}
            <div className="card" style={{ marginBottom: '20px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 className="section-title" style={{ fontSize: '18px', margin: 0 }}>Asset Overview</h3>
                    <button
                        className="btn btn-primary"
                        onClick={() => setIsAssetModalOpen(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '14px' }}
                    >
                        <span>+</span> Manage Assets
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' }}>

                    {/* EI Assets */}
                    <div style={{
                        background: '#f0f9ff',
                        border: '1px solid #bae6fd',
                        borderRadius: '12px',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}>
                        <div style={{ fontSize: '36px', fontWeight: '800', color: '#0284c7', lineHeight: 1, marginBottom: '8px' }}>
                            {assetStats.ei}
                        </div>
                        <div style={{ fontSize: '14px', color: '#0369a1', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            EI Assets
                        </div>
                    </div>

                    {/* Points */}
                    <div style={{
                        background: '#fdf2f8',
                        border: '1px solid #fbcfe8',
                        borderRadius: '12px',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}>
                        <div style={{ fontSize: '36px', fontWeight: '800', color: '#db2777', lineHeight: 1, marginBottom: '8px' }}>
                            {assetStats.points}
                        </div>
                        <div style={{ fontSize: '14px', color: '#be185d', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Points
                        </div>
                    </div>

                    {/* Signals */}
                    <div style={{
                        background: '#fefce8',
                        border: '1px solid #fde047',
                        borderRadius: '12px',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}>
                        <div style={{ fontSize: '36px', fontWeight: '800', color: '#ca8a04', lineHeight: 1, marginBottom: '8px' }}>
                            {assetStats.signals}
                        </div>
                        <div style={{ fontSize: '14px', color: '#a16207', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Signals
                        </div>
                    </div>

                    {/* Track Circuits */}
                    <div style={{
                        background: '#f0fdf4',
                        border: '1px solid #bbf7d0',
                        borderRadius: '12px',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}>
                        <div style={{ fontSize: '36px', fontWeight: '800', color: '#16a34a', lineHeight: 1, marginBottom: '8px' }}>
                            {assetStats.trackCircuits}
                        </div>
                        <div style={{ fontSize: '14px', color: '#15803d', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Track Circuits
                        </div>
                    </div>

                </div>
            </div>

            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                <a href="/work-report" className="btn btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>
                    + Submit Your Work Log
                </a>
            </div>

            <div className="card">
                <div className="section-title">Subordinate Work Reports</div>
                <div className="table-container">
                    {reportsLoading ? (
                        <div style={{ padding: '20px', textAlign: 'center', color: 'var(--muted)' }}>Loading reports...</div>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Author</th>
                                    <th>Category</th>
                                    <th>Station</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {myReports.length > 0 ? myReports.map((r: WorkReport) => (
                                    <tr key={r.id}>
                                        <td>{r.date}</td>
                                        <td>{r.authorName}</td>
                                        <td>{r.classification ? r.classification.toUpperCase() : 'N/A'}</td>
                                        <td>{r.station}</td>
                                        <td>
                                            <button
                                                onClick={() => setViewingReport(r)}
                                                className="btn btn-sm btn-primary"
                                                style={{ padding: '4px 12px', fontSize: '12px' }}
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--muted)' }}>No reports found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    )}
                    {reportsMeta && (
                        <PaginationControls
                            currentPage={reportsPage}
                            totalPages={reportsMeta.totalPages}
                            totalItems={reportsMeta.total}
                            onPageChange={setReportsPage}
                            loading={reportsLoading}
                        />
                    )}
                </div>
            </div>

            <div className="card">
                <div className="section-title">Team Failure Reports (Complaints)</div>
                <div className="alert alert-info" style={{ marginBottom: '20px', fontSize: '13px' }}>
                    💡 Complaints are automatically generated from failure reports. You can resolve complaints reported by your team.
                </div>
                <div className="table-container">
                    {complaintsLoading ? (
                        <div style={{ padding: '20px', textAlign: 'center', color: 'var(--muted)' }}>Loading complaints...</div>
                    ) : (
                        <table>
                            <thead>
                                <tr><th>ID</th><th>Status</th><th>Raised By</th><th>Issue</th><th>Actions</th></tr>
                            </thead>
                            <tbody>
                                {myComplaints.map((c: Complaint) => (
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
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button
                                                    onClick={() => setViewingComplaint(c)}
                                                    className="btn btn-sm btn-primary"
                                                    style={{ padding: '4px 12px', fontSize: '12px' }}
                                                >
                                                    View
                                                </button>
                                                {c.status === 'Open' && <button className="btn btn-primary btn-sm" onClick={() => setResolvingComplaint(c)}>Resolve</button>}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {myComplaints.length === 0 && (
                                    <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--muted)' }}>No complaints found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    )}
                    {complaintsMeta && (
                        <PaginationControls
                            currentPage={complaintsPage}
                            totalPages={complaintsMeta.totalPages}
                            totalItems={complaintsMeta.total}
                            onPageChange={setComplaintsPage}
                            loading={complaintsLoading}
                        />
                    )}
                </div>
            </div>

            {/* Resolution Modal */}
            {resolvingComplaint && (
                <ResolutionModal
                    complaint={resolvingComplaint}
                    onClose={() => setResolvingComplaint(null)}
                    onResolve={async (data) => {
                        await resolveComplaint(resolvingComplaint.id, data);
                        setResolvingComplaint(null);
                    }}
                />
            )}
            <WorkReportDetailModal report={viewingReport} onClose={() => setViewingReport(null)} />
            <ComplaintDetailModal complaint={viewingComplaint} onClose={() => setViewingComplaint(null)} />
            <AssetSelectionModal isOpen={isAssetModalOpen} onClose={() => setIsAssetModalOpen(false)} />
        </div>
    );
}

"use client";

import React, { useState } from "react";
import { usePaginatedData } from "@/app/hooks/usePaginatedData";
import { AxleCounterAsset } from "@/app/types/assets";
import { PaginationControls } from "@/app/components/PaginationControls";

export default function AxleCounterAssetsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const {
        data: assets,
        loading,
        page,
        setPage,
        meta,
        refresh
    } = usePaginatedData<AxleCounterAsset>(
        '/api/assets/axle-counter',
        { search: debouncedSearch },
        10,
        true
    );

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setTimeout(() => setDebouncedSearch(e.target.value), 500);
    };

    const columns: { key: keyof AxleCounterAsset | 'actions', label: string, minWidth: string }[] = [
        { key: 'sseSection', label: 'SSE Section', minWidth: '120px' },
        { key: 'station', label: 'Station', minWidth: '120px' },
        { key: 'axleCounterNo', label: 'Axle Counter No', minWidth: '150px' },
        { key: 'type', label: 'Type (SSDAC/MSDAC)', minWidth: '150px' },
        { key: 'make', label: 'Make', minWidth: '120px' },
        { key: 'sectionType', label: 'Section Type', minWidth: '120px' },
        { key: 'dateOfInstallation', label: 'Installation Date', minWidth: '150px' },
        { key: 'finacialYear', label: 'FY', minWidth: '100px' },
        { key: 'numberOfSensors', label: 'No. of Sensors', minWidth: '120px' },
        { key: 'sensor1Location', label: 'Sensor 1 Loc', minWidth: '120px' },
        { key: 'sensor2Location', label: 'Sensor 2 Loc', minWidth: '120px' },
        { key: 'vduMakeModel', label: 'VDU Make/Model', minWidth: '150px' },
        { key: 'connectivityType', label: 'Connectivity', minWidth: '120px' },
        { key: 'redundancyStatus', label: 'Redundancy', minWidth: '120px' },
        { key: 'status', label: 'Status', minWidth: '100px' },
        { key: 'actions', label: 'Actions', minWidth: '100px' }
    ];

    return (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '24px 24px 0 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <a href="/dashboard/sse" className="btn btn-outline" style={{ padding: '8px' }}>
                            ← Back
                        </a>
                        <h2 className="section-title" style={{ margin: 0 }}>Axle Counter Assets</h2>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                            type="text"
                            placeholder="Search Axle Counters..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="input"
                            style={{ width: '250px' }}
                        />
                        <button className="btn btn-primary" onClick={() => alert('Add feature coming soon!')}>
                            + Add Axle Counter
                        </button>
                    </div>
                </div>
            </div>

            <div className="table-container" style={{ overflowX: 'auto', position: 'relative' }}>
                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>
                ) : (
                    <table style={{ minWidth: 'max-content', borderCollapse: 'separate', borderSpacing: 0 }}>
                        <thead>
                            <tr>
                                {columns.map((col, idx) => (
                                    <th key={col.key} style={{
                                        position: idx === 0 ? 'sticky' : (col.key === 'actions' ? 'sticky' : 'static'),
                                        left: idx === 0 ? 0 : 'auto',
                                        right: col.key === 'actions' ? 0 : 'auto',
                                        zIndex: (idx === 0 || col.key === 'actions') ? 20 : 1,
                                        backgroundColor: (idx === 0 || col.key === 'actions') ? 'white' : 'var(--card-bg)',
                                        minWidth: col.minWidth,
                                        boxShadow: idx === 0 ? '2px 0 5px rgba(0,0,0,0.1)' : (col.key === 'actions' ? '-2px 0 5px rgba(0,0,0,0.1)' : 'none'),
                                        borderBottom: '1px solid #e2e8f0',
                                        padding: '12px 16px'
                                    }}>
                                        {col.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {assets.map((asset) => (
                                <tr key={asset.id}>
                                    {columns.map((col, idx) => {
                                        const isFirst = idx === 0;
                                        const isLast = col.key === 'actions';

                                        if (isLast) return (
                                            <td key="actions" style={{
                                                position: 'sticky', right: 0, zIndex: 10,
                                                backgroundColor: 'white',
                                                boxShadow: '-2px 0 5px rgba(0,0,0,0.1)',
                                                borderBottom: '1px solid #e2e8f0',
                                                padding: '12px 16px'
                                            }}>
                                                <button className="btn btn-sm btn-outline">Edit</button>
                                            </td>
                                        );

                                        return (
                                            <td key={col.key} style={{
                                                position: isFirst ? 'sticky' : 'static',
                                                left: isFirst ? 0 : 'auto',
                                                zIndex: isFirst ? 10 : 1,
                                                backgroundColor: 'white',
                                                boxShadow: isFirst ? '2px 0 5px rgba(0,0,0,0.1)' : 'none',
                                                borderRight: '1px solid #e2e8f0',
                                                borderBottom: '1px solid #e2e8f0',
                                                padding: '12px 16px',
                                                whiteSpace: 'nowrap'
                                            }}>
                                                {String(asset[col.key as keyof AxleCounterAsset] || '')}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div style={{ padding: '0 24px 24px 24px' }}>
                <PaginationControls
                    currentPage={page}
                    totalPages={meta?.totalPages || 1}
                    totalItems={meta?.total || 0}
                    onPageChange={setPage}
                    loading={loading}
                />
            </div>
        </div>
    );
}

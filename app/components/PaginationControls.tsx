import React from 'react';

interface Props {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalItems: number;
    loading?: boolean;
}

export function PaginationControls({ currentPage, totalPages, onPageChange, totalItems, loading }: Props) {
    if (totalPages <= 1) return null;

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '20px',
            paddingTop: '15px',
            borderTop: '1px solid var(--border)'
        }}>
            <div style={{ fontSize: '13px', color: 'var(--muted)' }}>
                Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({totalItems} items)
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
                <button
                    className="btn btn-outline btn-sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1 || loading}
                    style={{ padding: '6px 12px' }}
                >
                    Previous
                </button>
                <div style={{ display: "flex", gap: "4px" }}>
                    {/* Simple page numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                        .map((p, i, arr) => (
                            <React.Fragment key={p}>
                                {i > 0 && arr[i - 1] !== p - 1 && <span style={{ padding: '4px', color: 'var(--muted)' }}>...</span>}
                                <button
                                    className={`btn btn-sm ${p === currentPage ? 'btn-primary' : 'btn-outline'}`}
                                    onClick={() => onPageChange(p)}
                                    disabled={loading}
                                    style={{ width: '32px', padding: '0', display: 'flex', justifyContent: 'center' }}
                                >
                                    {p}
                                </button>
                            </React.Fragment>
                        ))}
                </div>
                <button
                    className="btn btn-outline btn-sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || loading}
                    style={{ padding: '6px 12px' }}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

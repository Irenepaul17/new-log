"use client";

import React from 'react';
import { useGlobal } from '@/app/context/GlobalContext';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const { currentUser, logout } = useGlobal();
    const router = useRouter();

    React.useEffect(() => {
        if (!currentUser) {
            router.push('/');
        }
    }, [currentUser, router]);

    if (!currentUser) {
        return null;
    }

    return (
        <div className="screen active" style={{ display: 'block', padding: '0' }}>
            <div className="card" style={{ maxWidth: '900px', margin: '0 auto' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '24px',
                    paddingBottom: '24px',
                    borderBottom: '1px solid var(--border)',
                    marginBottom: '32px'
                }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'var(--primary-soft)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--primary)',
                        fontSize: '32px',
                        fontWeight: 700
                    }}>
                        {currentUser.name.charAt(0)}
                    </div>
                    <div style={{ flex: 1 }}>
                        <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 4px 0' }}>
                            {currentUser.name}
                        </h2>
                        <p style={{ color: 'var(--muted)', margin: 0, fontSize: '14px' }}>
                            {currentUser.sub}
                        </p>
                    </div>
                    <button
                        onClick={logout}
                        className="btn btn-outline"
                        style={{ color: '#ef4444', borderColor: '#ef4444' }}
                    >
                        Logout
                    </button>
                </div>

                <div>
                    <h3 style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        color: 'var(--muted)',
                        marginBottom: '20px',
                        letterSpacing: '0.05em',
                    }}>
                        Contact Information
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                        <div className="input-group">
                            <label style={{ fontSize: '13px', marginBottom: '6px' }}>Full Name</label>
                            <input type="text" readOnly value={currentUser.name} style={{ background: '#f9fafb', borderColor: '#e5e7eb' }} />
                        </div>
                        <div className="input-group">
                            <label style={{ fontSize: '13px', marginBottom: '6px' }}>Official Email</label>
                            <input type="email" readOnly value={currentUser.email} style={{ background: '#f9fafb', borderColor: '#e5e7eb' }} />
                        </div>
                        <div className="input-group">
                            <label style={{ fontSize: '13px', marginBottom: '6px' }}>Phone Number</label>
                            <input type="text" readOnly value={currentUser.phone} style={{ background: '#f9fafb', borderColor: '#e5e7eb' }} />
                        </div>
                        <div className="input-group">
                            <label style={{ fontSize: '13px', marginBottom: '6px' }}>Employee ID (PF)</label>
                            <input type="text" readOnly value={currentUser.pfNumber} style={{ background: '#f9fafb', borderColor: '#e5e7eb' }} />
                        </div>
                        <div className="input-group">
                            <label style={{ fontSize: '13px', marginBottom: '6px' }}>Role</label>
                            <input type="text" readOnly value={currentUser.role.toUpperCase()} style={{ background: '#f9fafb', borderColor: '#e5e7eb' }} />
                        </div>
                        {currentUser.teamId && (
                            <div className="input-group">
                                <label style={{ fontSize: '13px', marginBottom: '6px' }}>Team</label>
                                <input type="text" readOnly value={`Team ${currentUser.teamId}`} style={{ background: '#f9fafb', borderColor: '#e5e7eb' }} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

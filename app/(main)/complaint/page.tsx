"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ComplaintPage() {
    const router = useRouter();
    const [category, setCategory] = useState("Equipment");
    const [description, setDescription] = useState("");

    const handleSubmit = () => {
        if (!description) {
            alert('Description is required.');
            return;
        }

        // Mock submission logic
        alert('Complaint raised successfully!');

        // In a real app, we would post to an API here
        // For now, we just redirect back to a dashboard (simulating role-based return)
        // Since we don't have auth state easily valid here yet, sending to JE dashboard
        router.push('/dashboard/je');
    };

    return (
        <div className="screen active" style={{ display: 'block' }}>
            <div className="alert alert-info">
                <strong>RESOLUTION PROCESS:</strong> Your complaint will be assigned to <strong>ADSTE Sunita Sharma</strong>.
            </div>

            <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div className="section-title">Raise New Complaint</div>

                <div className="input-group">
                    <label>Category *</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option>Equipment</option>
                        <option>Safety</option>
                        <option>Transport</option>
                        <option>Infrastructure</option>
                        <option>Personnel</option>
                        <option>Other</option>
                    </select>
                </div>

                <div className="input-group">
                    <label>Issue Description *</label>
                    <textarea
                        rows={5}
                        placeholder="Describe the issue in detail - be specific about the problem and impact"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                </div>

                <div className="input-group">
                    <label>Attachments (Photos/PDF)</label>
                    <div
                        style={{
                            border: '2px dashed var(--border)',
                            padding: '40px',
                            textAlign: 'center',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--muted)',
                            background: '#f8fafc',
                        }}
                    >
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            style={{ marginBottom: '12px', opacity: 0.5 }}>
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="17 8 12 3 7 8"></polyline>
                            <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                        <div>Drag and drop files or <span
                            style={{ color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}>Browse</span>
                        </div>
                        <div style={{ fontSize: '12px', marginTop: '8px' }}>Supports JPG, PNG, PDF up to 10MB</div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                    <button className="btn btn-primary" onClick={handleSubmit} style={{ flex: 2 }}>SUBMIT COMPLAINT</button>
                    <button className="btn btn-outline" onClick={() => router.back()} style={{ flex: 1 }}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

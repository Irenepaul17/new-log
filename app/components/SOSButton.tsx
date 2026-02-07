"use client";

import React, { useState } from "react";
import { useGlobal } from "@/app/context/GlobalContext";

export function SOSButton() {
    const { currentUser } = useGlobal();
    const [isConfirming, setIsConfirming] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [done, setDone] = useState(false);

    if (!currentUser) return null;

    const handleSOS = async () => {
        setIsSending(true);
        try {
            const res = await fetch('/api/sos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    senderId: currentUser.id,
                    message: `EMERGENCY SOS: ${currentUser.name} (${currentUser.role.toUpperCase()}) needs immediate assistance.`
                })
            });

            if (res.ok) {
                setDone(true);
                setTimeout(() => {
                    setDone(false);
                    setIsConfirming(false);
                }, 3000);
            } else {
                alert("Failed to send SOS. Please check your connection.");
            }
        } catch (e) {
            console.error(e);
            alert("An error occurred while sending SOS.");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div style={{ position: 'relative' }}>
            <button
                onClick={() => setIsConfirming(true)}
                style={{
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 20px',
                    fontSize: '14px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.4)',
                    transition: 'all 0.2s ease',
                    animation: 'pulseSOS 2s infinite'
                }}
                onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
                <span style={{ fontSize: '18px' }}>🚨</span> SOS EMERGENCY
            </button>

            <style jsx>{`
                @keyframes pulseSOS {
                    0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
                    70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
                }
            `}</style>

            {isConfirming && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10000,
                    backdropFilter: 'blur(4px)'
                }}>
                    <div className="card" style={{
                        maxWidth: '400px',
                        width: '90%',
                        padding: '30px',
                        textAlign: 'center',
                        animation: 'slideIn 0.3s ease-out'
                    }}>
                        {done ? (
                            <div style={{ color: '#10b981' }}>
                                <div style={{ fontSize: '50px', marginBottom: '15px' }}>✅</div>
                                <h3 style={{ margin: '0 0 10px 0' }}>SOS SENT!</h3>
                                <p style={{ fontSize: '14px', color: 'var(--muted)' }}>
                                    Sr. DSTE, DSTE, and respective ADSTE have been notified via Email and SMS.
                                </p>
                            </div>
                        ) : (
                            <>
                                <div style={{ fontSize: '50px', marginBottom: '15px' }}>⚠️</div>
                                <h3 style={{ margin: '0 0 10px 0', color: '#ef4444' }}>CONFIRM EMERGENCY</h3>
                                <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '25px' }}>
                                    This will immediately notify all higher authorities (Sr. DSTE, DSTE, ADSTE) about your emergency. Proceed only if urgent.
                                </p>
                                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                                    <button
                                        className="btn btn-outline"
                                        onClick={() => setIsConfirming(false)}
                                        disabled={isSending}
                                        style={{ flex: 1 }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="btn"
                                        style={{
                                            flex: 1,
                                            backgroundColor: '#ef4444',
                                            color: 'white',
                                            fontWeight: '700'
                                        }}
                                        onClick={handleSOS}
                                        disabled={isSending}
                                    >
                                        {isSending ? "Sending..." : "SEND SOS"}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

"use client";

import React, { useEffect, useState } from "react";
import { useGlobal } from "@/app/context/GlobalContext";

interface SOSAlert {
    id: string;
    senderName: string;
    senderRole: string;
    message: string;
    timestamp: string;
}

export function SOSAlertListener() {
    const { currentUser } = useGlobal();
    const [alerts, setAlerts] = useState<SOSAlert[]>([]);

    useEffect(() => {
        if (!currentUser) return;

        // Superior roles who should receive notifications
        const superiorRoles = ['sr-dste', 'dste', 'adste'];
        if (!superiorRoles.includes(currentUser.role)) return;

        const checkAlerts = async () => {
            try {
                const res = await fetch(`/api/sos?role=${currentUser.role}&teamId=${currentUser.teamId || ""}`);
                if (res.ok) {
                    const data = await res.json();
                    setAlerts(data);
                }
            } catch (e) {
                console.error("Failed to fetch SOS alerts", e);
            }
        };

        checkAlerts();
        const interval = setInterval(checkAlerts, 10000); // Poll every 10 seconds
        return () => clearInterval(interval);
    }, [currentUser]);

    if (alerts.length === 0) return null;

    return (
        <div style={{ marginBottom: '20px' }}>
            {alerts.map(alert => (
                <div
                    key={alert.id}
                    style={{
                        backgroundColor: '#fef2f2',
                        border: '2px solid #ef4444',
                        borderRadius: '12px',
                        padding: '16px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        color: '#991b1b',
                        boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.1), 0 2px 4px -1px rgba(239, 68, 68, 0.06)',
                        animation: 'shake 0.5s ease-in-out infinite alternate',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <div style={{
                        fontSize: '32px',
                        animation: 'pulse 1s infinite'
                    }}>🚨</div>
                    <div style={{ flex: 1 }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '4px'
                        }}>
                            <strong style={{ fontSize: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                EMERGENCY SOS ALERT
                            </strong>
                            <span style={{ fontSize: '11px', opacity: 0.7 }}>
                                {new Date(alert.timestamp).toLocaleTimeString()}
                            </span>
                        </div>
                        <p style={{ margin: 0, fontSize: '14px', fontWeight: 500 }}>
                            {alert.senderName} ({alert.senderRole.toUpperCase()}) needs assistance:
                            <span style={{ marginLeft: '5px', fontWeight: 400 }}>{alert.message}</span>
                        </p>
                    </div>
                </div>
            ))}
            <style jsx>{`
                @keyframes shake {
                    from { transform: translateX(-2px); }
                    to { transform: translateX(2px); }
                }
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.2); opacity: 0.7; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
}

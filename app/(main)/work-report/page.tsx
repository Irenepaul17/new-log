"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useGlobal } from '@/app/context/GlobalContext';

// Updated SSE Station mappings based on available PDF text and feedback
const SSE_STATIONS: Record<string, string[]> = {
    "MAS": ["MAS", "MASS", "20LF"],
    "BBQ": ["BBQ", "BBQ-KOK", "KOK", "KOK-TNP", "TNP", "TNP-TVT", "TVT", "TVT-WST", "WST", "WST-KOTR", "KOTR", "KOTR-PVM", "PVM", "PVM-ENR", "ENR", "ENR-AKP", "AKP", "AKP-AVD", "AVD", "AVD-HC", "HC", "HC-PAB", "PAB", "PAB-PTMS", "PTMS", "PTMS-NEC", "NEC", "NEC-TI", "TI", "TI-TRL", "TRL", "TRL-EGT", "EGT", "EGT-KBT", "KBT", "KBT-MAF", "MAF", "MAF-SPAM", "SPAM", "SPAM-AJJ", "AJJ", "AJJ-AJJ", "AJJ-PLMG", "PLMG", "PLMG-TO", "TO", "21LF", "ABU"],
    "TVT": ["TVT"],
    "GPD": ["GPD", "ELR", "AKM"],
    "SPE": ["SPE"],
    "NYP": ["NYP"],
    "TRL": ["TRL", "PTMS", "MAF"],
    "AJJ (E)": ["AJJ (E)"],
    "AJJ (W)": ["AJJ (W)"],
    "TRT": ["TRT"],
    "KPDE": ["KPDE"],
    "KPDW": ["KPDW"],
    "AB": ["AB"],
    "JTJ": ["JTJ", "JTJ AUX"],
    "MSB": ["MSB", "MSB-RPM", "MSB-MS", "MSB-MPK", "MPK", "MSB-MCPK", "MCPK", "MCPK-MTMY", "MTMY", "MTMY-VLCY", "VLCY"],
    "MS": ["MS", "MS-MKK", "MKK", "MKK-STM", "STM", "STM-PV", "PV", "PV-CMP"],
    "TBM": ["TBM", "TMVL", "TBMS", "PRGL", "VDR", "UPM", "CMMP", "TBM-CGL"],
    "CGL": ["CGL", "PWU", "CGL-VB", "VB", "CGL-PALR", "PALR", "PALR-WJ", "WJ", "WJ-CJE", "CJE"],
    "TMV": ["TMV", "MLMR", "MMK", "ACK", "KSG", "TUA", "TUA-TMV"]
};

export default function WorkReportPage() {
    const router = useRouter();
    const { currentUser, addReport, addComplaint } = useGlobal();

    // Section 1-3: Basic
    const [section, setSection] = useState("MAS");
    const [station, setStation] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [shift, setShift] = useState("Morning");

    // Section 4: Classification
    const [classification, setClassification] = useState("");

    // Section 5: Maintenance
    const [maintainedGears, setMaintainedGears] = useState<string[]>([]);
    const [maintDetails, setMaintDetails] = useState("");

    // Section 6: Special Work
    const [specialWorkOn, setSpecialWorkOn] = useState("");
    const [specialWorkDetails, setSpecialWorkDetails] = useState("");

    // Section 7: Other Dept
    const [otherDeptDetails, setOtherDeptDetails] = useState("");

    // Section 8: Misc
    const [miscDetails, setMiscDetails] = useState("");

    // Section 9: Failure Attention
    const [failureStatus, setFailureStatus] = useState("");
    const [gearFailed, setGearFailed] = useState("");
    const [failureType, setFailureType] = useState("");
    const [inTime, setInTime] = useState("");
    const [rtTime, setRtTime] = useState("");
    const [failureClassification, setFailureClassification] = useState("");
    const [failureDetails, setFailureDetails] = useState("");
    const [actualFailureDetails, setActualFailureDetails] = useState("");

    // Section 10: Disconnection
    const [hasDisconnection, setHasDisconnection] = useState(""); // Default empty, hides section
    const [discStatus, setDiscStatus] = useState("");
    const [discPermission, setDiscPermission] = useState("");
    const [discNo, setDiscNo] = useState("");
    const [discFor, setDiscFor] = useState("");
    const [discDate, setDiscDate] = useState("");
    const [discTime, setDiscTime] = useState("");
    const [reconDate, setReconDate] = useState("");
    const [reconTime, setReconTime] = useState("");

    // Section 11: Replacement
    const [replaceGear, setReplaceGear] = useState("");

    // -- Sub-forms for Replacement --
    // Track DCTC
    const [dctcTrackNo, setDctcTrackNo] = useState("");
    const [dctcAssetReplaced, setDctcAssetReplaced] = useState("");

    // Track AFTC
    const [aftcTrackNo, setAftcTrackNo] = useState("");
    const [aftcMake, setAftcMake] = useState("");
    const [aftcModel, setAftcModel] = useState("");
    const [aftcFreq, setAftcFreq] = useState("");

    // Track Axle Counter
    const [acTrackNo, setAcTrackNo] = useState("");
    const [acType, setAcType] = useState(""); // SSDAC / HASSDAC / MSDAC
    const [acMake, setAcMake] = useState("");

    // Signal Replacement
    const [signalNo, setSignalNo] = useState("");
    const [signalType, setSignalType] = useState(""); // Main / Shunt / Route / Calling On
    const [signalAspect, setSignalAspect] = useState(""); // 2/3/4 Aspect

    // Battery Replacement
    const [batteryType, setBatteryType] = useState("");
    const [batteryAssetName, setBatteryAssetName] = useState("");
    const [batteryCircuit, setBatteryCircuit] = useState("");
    const [batteryCells, setBatteryCells] = useState("");
    const [batteryMake, setBatteryMake] = useState("");
    const [batteryCapacity, setBatteryCapacity] = useState(""); // Added
    const [batteryInstallDate, setBatteryInstallDate] = useState(""); // Added

    // Relay Replacement
    const [oldRelayType, setOldRelayType] = useState("");
    const [oldRelayMake, setOldRelayMake] = useState("");
    const [oldRelaySerial, setOldRelaySerial] = useState("");
    const [oldRelayContact, setOldRelayContact] = useState("");
    const [oldRelayLHRH, setOldRelayLHRH] = useState(""); // Added
    const [oldRelayKgs, setOldRelayKgs] = useState(""); // Added

    const [newRelayType, setNewRelayType] = useState("");
    const [newRelayMake, setNewRelayMake] = useState("");
    const [newRelaySerial, setNewRelaySerial] = useState("");
    const [newRelayContact, setNewRelayContact] = useState("");
    const [newRelayLHRH, setNewRelayLHRH] = useState(""); // Added
    const [newRelayKgs, setNewRelayKgs] = useState(""); // Added

    // Generic Replacement Details (Point, Power Room, IPS, etc.)
    const [genOldMake, setGenOldMake] = useState("");
    const [genOldSerial, setGenOldSerial] = useState("");
    const [genNewMake, setGenNewMake] = useState("");
    const [genNewSerial, setGenNewSerial] = useState("");
    const [genInstallDate, setGenInstallDate] = useState("");

    // Glued/RDSO Joint
    const [jointTrackNo, setJointTrackNo] = useState("");
    const [jointType, setJointType] = useState(""); // Glued / RDSO
    const [jointSide, setJointSide] = useState(""); // Left / Right / Both

    // Final Confirmation
    const [finalConfirmation, setFinalConfirmation] = useState("");

    // Attachments
    const [attachments, setAttachments] = useState<{ name: string; data: string; type: string }[]>([]);

    const stationList = useMemo(() => SSE_STATIONS[section] || [], [section]);

    const resetForm = () => {
        setClassification("");
        setMaintainedGears([]);
        setMaintDetails("");
        setSpecialWorkOn("");
        setSpecialWorkDetails("");
        setOtherDeptDetails("");
        setMiscDetails("");

        setFailureStatus("");
        setGearFailed("");
        setFailureType("");
        setInTime("");
        setRtTime("");
        setFailureClassification("");
        setFailureDetails("");
        setActualFailureDetails("");

        setHasDisconnection("");
        setDiscStatus("");
        setDiscPermission("");
        setDiscNo("");
        setDiscFor("");
        setDiscDate("");
        setDiscTime("");
        setReconDate("");
        setReconTime("");

        setReplaceGear("");
        setDctcTrackNo(""); setDctcAssetReplaced("");
        setAftcTrackNo(""); setAftcMake(""); setAftcModel(""); setAftcFreq("");
        setAcTrackNo(""); setAcType(""); setAcMake("");
        setSignalNo(""); setSignalType(""); setSignalAspect("");
        setBatteryType(""); setBatteryAssetName(""); setBatteryCircuit(""); setBatteryCells(""); setBatteryMake(""); setBatteryCapacity(""); setBatteryInstallDate("");
        setOldRelayType(""); setOldRelayMake(""); setOldRelaySerial(""); setOldRelayContact(""); setOldRelayLHRH(""); setOldRelayKgs("");
        setNewRelayType(""); setNewRelayMake(""); setNewRelaySerial(""); setNewRelayContact(""); setNewRelayLHRH(""); setNewRelayKgs("");
        setGenOldMake(""); setGenOldSerial(""); setGenNewMake(""); setGenNewSerial(""); setGenInstallDate("");
        setJointTrackNo(""); setJointType(""); setJointSide("");

        setFinalConfirmation("");
        setAttachments([]);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newAttachments: { name: string; data: string; type: string }[] = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            // Validate file type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
            if (!validTypes.includes(file.type)) {
                alert(`File "${file.name}" is not a valid type. Only images (JPG, PNG, GIF) and PDFs are allowed.`);
                continue;
            }

            // Validate file size (5MB max)
            if (file.size > 5 * 1024 * 1024) {
                alert(`File "${file.name}" is too large. Maximum size is 5MB.`);
                continue;
            }

            // Convert to base64
            const reader = new FileReader();
            const base64Promise = new Promise<string>((resolve) => {
                reader.onload = () => resolve(reader.result as string);
                reader.readAsDataURL(file);
            });

            const base64Data = await base64Promise;
            newAttachments.push({
                name: file.name,
                data: base64Data,
                type: file.type
            });
        }

        setAttachments(prev => [...prev, ...newAttachments]);
        e.target.value = ''; // Reset input
    };

    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (submitAnother: boolean) => {
        if (!currentUser) return;
        if (finalConfirmation !== "YES") {
            alert("Please confirm that you have entered all works done in your shift.");
            return;
        }

        const reportData = {
            date,
            authorId: currentUser.id,
            authorName: currentUser.name,
            section,
            station,
            shift,
            classification,
            details: {
                maintenance: classification === 'maintenance' ? { gears: maintainedGears, text: maintDetails } : null,
                specialWork: classification === 'st' ? { on: specialWorkOn, text: specialWorkDetails } : null,
                otherDept: classification === 'other' ? otherDeptDetails : null,
                misc: classification === 'misc' ? miscDetails : null,
                failure: classification === 'failure' ? {
                    status: failureStatus,
                    gear: gearFailed,
                    type: failureType,
                    inTime,
                    rtTime,
                    classification: failureClassification,
                    details: failureDetails,
                    actualDetails: actualFailureDetails
                } : null,
                disconnection: hasDisconnection === 'Yes' ? {
                    status: discStatus,
                    permission: discPermission,
                    no: discNo,
                    for: discFor,
                    discDate,
                    discTime,
                    reconDate,
                    reconTime
                } : null,
                replacement: classification === 'replacement' ? {
                    gear: replaceGear,
                    trackDCTC: replaceGear === 'Track (DCTC)' ? { trackNo: dctcTrackNo, asset: dctcAssetReplaced } : null,
                    trackAFTC: replaceGear === 'Track (AFTC)' ? { trackNo: aftcTrackNo, make: aftcMake, model: aftcModel, freq: aftcFreq } : null,
                    trackAC: replaceGear === 'Track (Axle Counter)' ? { trackNo: acTrackNo, type: acType, make: acMake } : null,
                    signal: replaceGear === 'Signal' ? { no: signalNo, type: signalType, aspect: signalAspect } : null,
                    battery: replaceGear === 'Battery' ? {
                        type: batteryType, assetName: batteryAssetName, circuit: batteryCircuit,
                        cells: batteryCells, make: batteryMake, capacity: batteryCapacity, installDate: batteryInstallDate
                    } : null,
                    relay: replaceGear === 'Relay Room (Relay)' ? {
                        old: { type: oldRelayType, make: oldRelayMake, serial: oldRelaySerial, contact: oldRelayContact, lhrh: oldRelayLHRH, kgs: oldRelayKgs },
                        new: { type: newRelayType, make: newRelayMake, serial: newRelaySerial, contact: newRelayContact, lhrh: newRelayLHRH, kgs: newRelayKgs }
                    } : null,
                    generic: ['Point', 'Power Room', 'IPS', 'Relay Room (Other than Relay)', 'LC Gate', 'AFTC / MSDAC HUT', 'Auto Section', 'General'].includes(replaceGear) ? {
                        oldMake: genOldMake, oldSerial: genOldSerial, newMake: genNewMake, newSerial: genNewSerial, installDate: genInstallDate
                    } : null,
                    joint: (replaceGear === 'Glued Joint' || replaceGear === 'RDSO Joint') ? { trackNo: jointTrackNo, type: replaceGear, side: jointSide } : null,
                } : null,
                finalConfirmation: finalConfirmation
            },
            attachments: attachments.length > 0 ? attachments : undefined
        };

        addReport(reportData);
        console.log("Report submitted. Classification:", classification, "FailureStatus:", failureStatus);

        // Auto-create complaint for ANY failure report (not just "Yes & Booked")
        if (classification === 'failure' && failureStatus && failureStatus !== 'No Failures') {
            console.log("Auto-generating complaint for:", gearFailed, "Status:", failureStatus);
            addComplaint({
                authorId: currentUser.id,
                authorName: currentUser.name,
                category: 'Failure',
                description: `[${failureStatus}] Gear: ${gearFailed}, Type: ${failureType || 'Not specified'}, Details: ${failureDetails}`,
                supervisorId: currentUser.superiorId
            });
        }

        if (submitAnother) {
            alert("✅ Work log submitted successfully! Form reset for another entry.");
            resetForm();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            alert("✅ Work log submitted successfully!");
            router.push(`/dashboard/${currentUser.role === 'technician' ? 'je' : currentUser.role}`);
        }
    };

    return (
        <div className="screen active" style={{ display: 'block', paddingBottom: '100px' }}>
            <div className="card" style={{ maxWidth: '900px', margin: '0 auto' }}>
                <div className="section-title">S & T WORK LOG BOOK</div>

                <div className="alert alert-info" style={{ marginBottom: '24px' }}>
                    <strong>GENERAL INSTRUCTIONS:</strong><br />
                    • Feed only one work at a time. Fields marked * are mandatory.<br />
                    • Enter disconnection details (if any) before submitting<br />
                    • If more than one work is done, use "SUBMIT & ENTER ANOTHER RESPONSE"
                </div>

                {/* SECTION 1: Email */}
                <div className="input-group">
                    <label>Email *</label>
                    <input type="email" readOnly style={{ background: '#f8fafc' }} value={currentUser?.email || ""} />
                </div>

                {/* SECTION 2: Location */}
                <div className="nested-container">
                    <div className="section-title" style={{ fontSize: '15px' }}>SECTION 1 & 2: LOCATION</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div className="input-group">
                            <label>SSE Section *</label>
                            <select value={section} onChange={e => { setSection(e.target.value); setStation(""); }}>
                                {Object.keys(SSE_STATIONS).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className="input-group">
                            <label>Station *</label>
                            <select value={station} onChange={e => setStation(e.target.value)} required>
                                <option value="">Select Station...</option>
                                {stationList.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* SECTION 3: Log Header */}
                <div className="nested-container">
                    <div className="section-title" style={{ fontSize: '15px' }}>SECTION 3: LOG HEADER</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div className="input-group">
                            <label>Date *</label>
                            <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
                        </div>
                        <div className="input-group">
                            <label>Shift *</label>
                            <select value={shift} onChange={e => setShift(e.target.value)} required>
                                <option>Night Odd Hrs to 07:00</option>
                                <option>Morning</option>
                                <option>Evening</option>
                                <option>Night Up to Odd Hrs</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* SECTION 4: Work Classification */}
                <div className="input-group" style={{ background: '#f1f5f9', padding: '20px', borderRadius: '12px', marginTop: '20px' }}>
                    <label style={{ fontWeight: 700 }}>SECTION 4: WORK CLASSIFICATION *</label>
                    <select value={classification} onChange={e => setClassification(e.target.value)} required>
                        <option value="">-- Choose Classification --</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="failure">Failure Attention</option>
                        <option value="st">S & T Special Work</option>
                        <option value="other">Work with Other Departments</option>
                        <option value="replacement">Replacement of Assets</option>
                        <option value="disconnection">Select for entering Disconnection</option>
                        <option value="disc_cancelled">Only Disconnection called and cancelled</option>
                        <option value="misc">Miscellaneous</option>
                    </select>
                </div>

                {/* SECTION 5: Maintenance */}
                {classification === 'maintenance' && (
                    <div className="nested-container" style={{ borderColor: 'var(--primary)' }}>
                        <div className="section-title">SECTION 5: MAINTENANCE</div>
                        <div className="input-group">
                            <label>Gear Maintained * (Multiple Allowed)</label>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px',
                                alignItems: 'flex-start'
                            }}>
                                {["Track", "Signal", "Point", "Power Room / Battery Room", "IPS", "Relay Room", "LC Gate", "AFTC / MSDAC HUT", "Auto Section", "General Maintenance"].map(g => (
                                    <label key={g} style={{
                                        fontWeight: 'normal',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        cursor: 'pointer',
                                        width: '100%',
                                        maxWidth: '50px'
                                    }}>
                                        <input
                                            type="checkbox"
                                            checked={maintainedGears.includes(g)}
                                            onChange={e => e.target.checked ? setMaintainedGears([...maintainedGears, g]) : setMaintainedGears(maintainedGears.filter(x => x !== g))}
                                            style={{ flexShrink: 0 }}
                                        />
                                        <span style={{ fontSize: '14px' }}>{g}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="input-group">
                            <label>Details of Maintenance Work Done *</label>
                            <textarea rows={4} value={maintDetails} onChange={e => setMaintDetails(e.target.value)} required />
                        </div>
                    </div>
                )}

                {/* SECTION 6: S & T Special Work */}
                {classification === 'st' && (
                    <div className="nested-container">
                        <div className="section-title">SECTION 6: S & T SPECIAL WORK</div>
                        <div className="input-group">
                            <label>S & T Special Work Done On *</label>
                            <select value={specialWorkOn} onChange={e => setSpecialWorkOn(e.target.value)} required>
                                <option value="">-- Select --</option>
                                {["Track", "Signal", "Point", "Location Box", "Power Room", "Relay Room", "LC Gate", "HUT", "Auto Section", "Other"].map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                        </div>
                        {specialWorkOn && (
                            <div className="input-group">
                                <label>Details of {specialWorkOn} Special Work Done *</label>
                                <textarea rows={4} value={specialWorkDetails} onChange={e => setSpecialWorkDetails(e.target.value)} required />
                            </div>
                        )}
                    </div>
                )}

                {/* SECTION 7: Work with Other Departments */}
                {classification === 'other' && (
                    <div className="nested-container">
                        <div className="section-title">SECTION 7: WORK WITH OTHER DEPARTMENTS</div>
                        <div className="input-group">
                            <label>Details of Work Done with Other Departments *</label>
                            <textarea rows={4} value={otherDeptDetails} onChange={e => setOtherDeptDetails(e.target.value)} required />
                        </div>
                    </div>
                )}

                {/* SECTION 8: Miscellaneous */}
                {classification === 'misc' && (
                    <div className="nested-container">
                        <div className="section-title">SECTION 8: MISCELLANEOUS WORK</div>
                        <div className="input-group">
                            <label>Details of Miscellaneous Work Done *</label>
                            <textarea rows={4} value={miscDetails} onChange={e => setMiscDetails(e.target.value)} required />
                        </div>
                    </div>
                )}

                {/* SECTION 9: Failure Attention */}
                {classification === 'failure' && (
                    <div className="nested-container" style={{ borderColor: '#ef4444' }}>
                        <div className="section-title">SECTION 9: FAILURE ATTENTION</div>
                        <div className="input-group">
                            <label>Any Failures in Your Shift? *</label>
                            <select value={failureStatus} onChange={e => setFailureStatus(e.target.value)} required>
                                <option value="">-- Select --</option>
                                <option>Yes & Booked</option>
                                <option>Yes & Not Booked</option>
                                <option>Un Booked Failures</option>
                                <option>No Failures</option>
                            </select>
                        </div>
                        {(failureStatus.includes('Yes') || failureStatus === 'Un Booked Failures') && (
                            <>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div className="input-group">
                                        <label>Gear Failed *</label>
                                        <select value={gearFailed} onChange={e => setGearFailed(e.target.value)} required>
                                            <option value="">-- Select --</option>
                                            <option>Track</option>
                                            <option>Signal</option>
                                            <option>Point</option>
                                            <option>LC Gate</option>
                                            <option>Block</option>
                                        </select>
                                    </div>
                                    <div className="input-group">
                                        <label>Failure Type</label>
                                        <select value={failureType} onChange={e => setFailureType(e.target.value)}>
                                            <option value="">-- Select --</option>
                                            <option>S & T Failure</option>
                                            <option>Engineering Failure</option>
                                            <option>OHE Department Failure</option>
                                            <option>Miscreant Activity</option>
                                            <option>Miscellaneous</option>
                                        </select>
                                    </div>
                                    <div className="input-group">
                                        <label>IN Time *</label>
                                        <input type="time" value={inTime} onChange={e => setInTime(e.target.value)} required />
                                    </div>
                                    <div className="input-group">
                                        <label>RT Time *</label>
                                        <input type="time" value={rtTime} onChange={e => setRtTime(e.target.value)} required />
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label>Failure Classification (Optional)</label>
                                    <input type="text" value={failureClassification} onChange={e => setFailureClassification(e.target.value)} />
                                </div>
                                <div className="input-group">
                                    <label>Failure Details * (As recorded in Signal Failure Register)</label>
                                    <textarea rows={3} value={failureDetails} onChange={e => setFailureDetails(e.target.value)} required />
                                </div>
                                <div className="input-group">
                                    <label>Actual Failure Details (For analysis only - optional)</label>
                                    <textarea rows={2} value={actualFailureDetails} onChange={e => setActualFailureDetails(e.target.value)} />
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* SECTION 10: Disconnection / Reconnection - Visible only if classification is specifically for Disconnection */}
                {(classification === 'disconnection' || classification === 'disc_cancelled') && (
                    <div className="nested-container">
                        <div className="section-title">SECTION 10: DISCONNECTION / RECONNECTION</div>
                        <div className="input-group">
                            <label>Any Disconnection Filled in Your Shift? *</label>
                            <select value={hasDisconnection} onChange={e => setHasDisconnection(e.target.value)} required>
                                <option value="">-- Select --</option>
                                <option>Yes</option>
                                <option>No</option>
                            </select>
                        </div>
                        {hasDisconnection === 'Yes' && (
                            <>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div className="input-group">
                                        <label>Disconnection Status</label>
                                        <select value={discStatus} onChange={e => setDiscStatus(e.target.value)}>
                                            <option value="">-- Select --</option>
                                            <option>Applied</option>
                                            <option>Cancelled by S&T</option>
                                        </select>
                                    </div>
                                    <div className="input-group">
                                        <label>Permission Status</label>
                                        <select value={discPermission} onChange={e => setDiscPermission(e.target.value)}>
                                            <option value="">-- Select --</option>
                                            <option>Permitted</option>
                                            <option>Not Permitted</option>
                                        </select>
                                    </div>
                                    <div className="input-group">
                                        <label>Disconnection No. *</label>
                                        <input type="text" value={discNo} onChange={e => setDiscNo(e.target.value)} required />
                                    </div>
                                    <div className="input-group">
                                        <label>Disconnection For</label>
                                        <select value={discFor} onChange={e => setDiscFor(e.target.value)}>
                                            <option value="">-- Select --</option>
                                            <option>Maintenance</option>
                                            <option>Failure</option>
                                        </select>
                                    </div>
                                    <div className="input-group">
                                        <label>Disconnection Date</label>
                                        <input type="date" value={discDate} onChange={e => setDiscDate(e.target.value)} />
                                    </div>
                                    <div className="input-group">
                                        <label>Disconnection Time</label>
                                        <input type="time" value={discTime} onChange={e => setDiscTime(e.target.value)} />
                                    </div>
                                    <div className="input-group">
                                        <label>Reconnection Date</label>
                                        <input type="date" value={reconDate} onChange={e => setReconDate(e.target.value)} />
                                    </div>
                                    <div className="input-group">
                                        <label>Reconnection Time</label>
                                        <input type="time" value={reconTime} onChange={e => setReconTime(e.target.value)} />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* SECTION 11: Asset Replacement */}
                {classification === 'replacement' && (
                    <div className="nested-container" style={{ borderColor: 'var(--secondary)' }}>
                        <div className="section-title">SECTION 11: ASSET REPLACEMENT</div>
                        <div className="input-group">
                            <label>Replacement Done in Gear *</label>
                            <select value={replaceGear} onChange={e => setReplaceGear(e.target.value)} required>
                                <option value="">-- Select --</option>
                                <option>Track (DCTC)</option>
                                <option>Track (AFTC)</option>
                                <option>Track (Axle Counter)</option>
                                <option>Signal</option>
                                <option>Point</option>
                                <option>Power Room</option>
                                <option>Battery</option>
                                <option>IPS</option>
                                <option>Relay Room (Relay)</option>
                                <option>Relay Room (Other than Relay)</option>
                                <option>LC Gate</option>
                                <option>AFTC / MSDAC HUT</option>
                                <option>Auto Section</option>
                                <option>Glued Joint</option>
                                <option>RDSO Joint</option>
                                <option>General</option>
                            </select>
                        </div>

                        {/* Track DCTC */}
                        {replaceGear === 'Track (DCTC)' && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div className="input-group">
                                    <label>Track No. *</label>
                                    <input type="text" value={dctcTrackNo} onChange={e => setDctcTrackNo(e.target.value)} required />
                                </div>
                                <div className="input-group">
                                    <label>Asset Replaced *</label>
                                    <select value={dctcAssetReplaced} onChange={e => setDctcAssetReplaced(e.target.value)} required>
                                        <option value="">-- Select --</option>
                                        <option>Track Battery</option><option>TJ</option><option>Choke</option><option>TF Resistance</option>
                                        <option>TLD</option><option>Glued Joint</option><option>RDSO Joint</option><option>Lead Wires</option>
                                        <option>Fuse</option><option>Track Relay</option><option>Track Proving Relay</option><option>Any Other Relay</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* Track AFTC */}
                        {replaceGear === 'Track (AFTC)' && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div className="input-group">
                                    <label>Track No. *</label>
                                    <input type="text" value={aftcTrackNo} onChange={e => setAftcTrackNo(e.target.value)} required />
                                </div>
                                <div className="input-group">
                                    <label>Make *</label>
                                    <input type="text" value={aftcMake} onChange={e => setAftcMake(e.target.value)} required />
                                </div>
                                <div className="input-group">
                                    <label>Model *</label>
                                    <input type="text" value={aftcModel} onChange={e => setAftcModel(e.target.value)} required />
                                </div>
                                <div className="input-group">
                                    <label>Frequency *</label>
                                    <input type="text" value={aftcFreq} onChange={e => setAftcFreq(e.target.value)} required />
                                </div>
                            </div>
                        )}

                        {/* Track Axle Counter */}
                        {replaceGear === 'Track (Axle Counter)' && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div className="input-group">
                                    <label>Track No. *</label>
                                    <input type="text" value={acTrackNo} onChange={e => setAcTrackNo(e.target.value)} required />
                                </div>
                                <div className="input-group">
                                    <label>Type *</label>
                                    <select value={acType} onChange={e => setAcType(e.target.value)} required>
                                        <option value="">-- Select --</option>
                                        <option>SSDAC</option><option>HASSDAC</option><option>MSDAC</option>
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label>Make *</label>
                                    <input type="text" value={acMake} onChange={e => setAcMake(e.target.value)} required />
                                </div>
                            </div>
                        )}

                        {/* Signal */}
                        {replaceGear === 'Signal' && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div className="input-group">
                                    <label>Signal No. *</label>
                                    <input type="text" value={signalNo} onChange={e => setSignalNo(e.target.value)} required />
                                </div>
                                <div className="input-group">
                                    <label>Type of Signal *</label>
                                    <select value={signalType} onChange={e => setSignalType(e.target.value)} required>
                                        <option value="">-- Select --</option>
                                        <option>Main</option><option>Shunt</option><option>Route</option><option>Calling On</option>
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label>Aspect Type *</label>
                                    <select value={signalAspect} onChange={e => setSignalAspect(e.target.value)} required>
                                        <option value="">-- Select --</option>
                                        <option>2 Aspect</option><option>3 Aspect</option><option>4 Aspect</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* Battery Replacement */}
                        {replaceGear === 'Battery' && (
                            <>
                                <div className="input-group">
                                    <label>Battery Type *</label>
                                    <select value={batteryType} onChange={e => setBatteryType(e.target.value)} required>
                                        <option value="">-- Select --</option>
                                        <option>Track Battery</option>
                                        <option>IPS Battery</option>
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label>Name of Asset Replaced *</label>
                                    <input type="text" value={batteryAssetName} onChange={e => setBatteryAssetName(e.target.value)} required />
                                </div>
                                <div className="input-group">
                                    <label>Circuit *</label>
                                    <input type="text" value={batteryCircuit} onChange={e => setBatteryCircuit(e.target.value)} required />
                                </div>
                                <div className="input-group">
                                    <label>Number of Cells Replaced *</label>
                                    <input type="number" value={batteryCells} onChange={e => setBatteryCells(e.target.value)} required />
                                </div>
                                <div className="input-group">
                                    <label>Capacity (AH) *</label>
                                    <input type="text" value={batteryCapacity} onChange={e => setBatteryCapacity(e.target.value)} required />
                                </div>
                                <div className="input-group">
                                    <label>Date of Installation *</label>
                                    <input type="date" value={batteryInstallDate} onChange={e => setBatteryInstallDate(e.target.value)} required />
                                </div>
                                <div className="input-group">
                                    <label>Make *</label>
                                    <input type="text" value={batteryMake} onChange={e => setBatteryMake(e.target.value)} required />
                                </div>
                            </>
                        )}

                        {/* Relay Replacement */}
                        {replaceGear === 'Relay Room (Relay)' && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div className="input-group">
                                    <label>Old Relay Type *</label>
                                    <input type="text" value={oldRelayType} onChange={e => setOldRelayType(e.target.value)} required />
                                </div>
                                <div className="input-group">
                                    <label>Old Relay Make *</label>
                                    <input type="text" value={oldRelayMake} onChange={e => setOldRelayMake(e.target.value)} required />
                                </div>
                                <div className="input-group">
                                    <label>Old Relay Serial No. *</label>
                                    <input type="text" value={oldRelaySerial} onChange={e => setOldRelaySerial(e.target.value)} required />
                                </div>
                                <div className="input-group">
                                    <label>Old Relay Contact *</label>
                                    <input type="text" value={oldRelayContact} onChange={e => setOldRelayContact(e.target.value)} required />
                                </div>
                                <div className="input-group">
                                    <label>Old Relay Position (LH/RH) *</label>
                                    <input type="text" value={oldRelayLHRH} onChange={e => setOldRelayLHRH(e.target.value)} required />
                                </div>
                                <div className="input-group">
                                    <label>Old Relay Weight (Kgs) *</label>
                                    <input type="text" value={oldRelayKgs} onChange={e => setOldRelayKgs(e.target.value)} required />
                                </div>

                                <div className="input-group">
                                    <label>New Relay Type *</label>
                                    <input type="text" value={newRelayType} onChange={e => setNewRelayType(e.target.value)} required />
                                </div>
                                <div className="input-group">
                                    <label>New Relay Make *</label>
                                    <input type="text" value={newRelayMake} onChange={e => setNewRelayMake(e.target.value)} required />
                                </div>
                                <div className="input-group">
                                    <label>New Relay Serial No. *</label>
                                    <input type="text" value={newRelaySerial} onChange={e => setNewRelaySerial(e.target.value)} required />
                                </div>
                                <div className="input-group">
                                    <label>New Relay Contact *</label>
                                    <input type="text" value={newRelayContact} onChange={e => setNewRelayContact(e.target.value)} required />
                                </div>
                                <div className="input-group">
                                    <label>New Relay Position (LH/RH) *</label>
                                    <input type="text" value={newRelayLHRH} onChange={e => setNewRelayLHRH(e.target.value)} required />
                                </div>
                                <div className="input-group">
                                    <label>New Relay Weight (Kgs) *</label>
                                    <input type="text" value={newRelayKgs} onChange={e => setNewRelayKgs(e.target.value)} required />
                                </div>
                            </div>
                        )}

                        {/* Generic Replacement */}
                        {['Point', 'Power Room', 'IPS', 'Relay Room (Other than Relay)', 'LC Gate', 'AFTC / MSDAC HUT', 'Auto Section', 'General'].includes(replaceGear) && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div className="input-group">
                                    <label>Old Asset Make *</label>
                                    <input type="text" value={genOldMake} onChange={e => setGenOldMake(e.target.value)} required />
                                </div>
                                <div className="input-group">
                                    <label>Old Asset Serial No. *</label>
                                    <input type="text" value={genOldSerial} onChange={e => setGenOldSerial(e.target.value)} required />
                                </div>
                                <div className="input-group">
                                    <label>New Asset Make *</label>
                                    <input type="text" value={genNewMake} onChange={e => setGenNewMake(e.target.value)} required />
                                </div>
                                <div className="input-group">
                                    <label>New Asset Serial No. *</label>
                                    <input type="text" value={genNewSerial} onChange={e => setGenNewSerial(e.target.value)} required />
                                </div>
                                <div className="input-group">
                                    <label>Date of Installation *</label>
                                    <input type="date" value={genInstallDate} onChange={e => setGenInstallDate(e.target.value)} required />
                                </div>
                            </div>
                        )}

                        {/* Joint Replacement */}
                        {(replaceGear === 'Glued Joint' || replaceGear === 'RDSO Joint') && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div className="input-group">
                                    <label>Track No. *</label>
                                    <input type="text" value={jointTrackNo} onChange={e => setJointTrackNo(e.target.value)} required />
                                </div>
                                <div className="input-group">
                                    <label>Side *</label>
                                    <select value={jointSide} onChange={e => setJointSide(e.target.value)} required>
                                        <option value="">-- Select --</option>
                                        <option>Left</option><option>Right</option><option>Both</option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ATTACHMENTS - Optional for all classifications */}
                {classification && (
                    <div className="nested-container">
                        <div className="section-title">ATTACHMENTS (Optional)</div>
                        <div className="alert alert-info" style={{ marginBottom: '20px', fontSize: '13px' }}>
                            📎 Attach photos or PDFs related to this work report (max 5MB per file)
                        </div>

                        <div className="input-group">
                            <label>Upload Files (Images: JPG, PNG, GIF | Documents: PDF)</label>
                            <input
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/gif,application/pdf"
                                multiple
                                onChange={handleFileUpload}
                                style={{
                                    padding: '12px',
                                    border: '2px dashed var(--border)',
                                    borderRadius: 'var(--radius-md)',
                                    cursor: 'pointer'
                                }}
                            />
                        </div>

                        {attachments.length > 0 && (
                            <div style={{ marginTop: '20px' }}>
                                <div style={{ fontWeight: 600, marginBottom: '12px', fontSize: '14px' }}>
                                    Attached Files ({attachments.length})
                                </div>
                                <div style={{ display: 'grid', gap: '12px' }}>
                                    {attachments.map((file, index) => (
                                        <div key={index} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            padding: '12px',
                                            border: '1px solid var(--border)',
                                            borderRadius: 'var(--radius-md)',
                                            background: 'var(--bg)'
                                        }}>
                                            {file.type.startsWith('image/') ? (
                                                <img
                                                    src={file.data}
                                                    alt={file.name}
                                                    style={{
                                                        width: '60px',
                                                        height: '60px',
                                                        objectFit: 'cover',
                                                        borderRadius: 'var(--radius-sm)'
                                                    }}
                                                />
                                            ) : (
                                                <div style={{
                                                    width: '60px',
                                                    height: '60px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    background: '#ef4444',
                                                    color: 'white',
                                                    borderRadius: 'var(--radius-sm)',
                                                    fontWeight: 700,
                                                    fontSize: '12px'
                                                }}>
                                                    PDF
                                                </div>
                                            )}
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: 600, fontSize: '14px' }}>{file.name}</div>
                                                <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                                                    {file.type.startsWith('image/') ? 'Image' : 'PDF Document'}
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeAttachment(index)}
                                                className="btn btn-outline"
                                                style={{
                                                    color: '#ef4444',
                                                    borderColor: '#ef4444',
                                                    padding: '8px 16px',
                                                    fontSize: '13px'
                                                }}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* FINAL CONFIRMATION - Only visible if classification is selected */}
                {classification && (
                    <div className="nested-container">
                        <div className="section-title">FINAL CONFIRMATION</div>
                        <div className="input-group">
                            <label>Have you entered all works done in your shift? *</label>
                            <select value={finalConfirmation} onChange={e => setFinalConfirmation(e.target.value)} required>
                                <option value="">-- Select --</option>
                                <option value="YES">YES</option>
                                <option value="NO">NO, I want to enter another work</option>
                            </select>
                        </div>
                    </div>
                )}

                {/* Submit Buttons - Only visible if classification is selected */}
                {classification && (
                    <div style={{ display: 'flex', gap: '12px', marginTop: '40px' }}>
                        <button
                            className="btn btn-primary"
                            style={{ flex: 2 }}
                            onClick={() => handleSubmit(false)}
                            disabled={!classification || !station || finalConfirmation !== "YES"}
                        >
                            SUBMIT FINAL REPORT
                        </button>
                        <button
                            className="btn btn-secondary"
                            style={{ flex: 1.5 }}
                            onClick={() => handleSubmit(true)}
                            disabled={!classification || !station}
                        >
                            SUBMIT & ENTER ANOTHER RESPONSE
                        </button>
                        <button
                            className="btn btn-outline"
                            style={{ flex: 1 }}
                            onClick={() => router.back()}
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

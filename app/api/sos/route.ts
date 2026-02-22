import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import UserModel from '@/app/models/User';
import SOSAlertModel from '@/app/models/SOSAlert';
import { sendEmail } from '@/lib/mail';

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { senderId, message } = await request.json();

        // 1. Find Sender
        const sender = await UserModel.findById(senderId);
        if (!sender) {
            return NextResponse.json({ error: 'Sender not found' }, { status: 404 });
        }

        // 2. Find Recipients: Sr. DSTE, DSTE, and Respective ADSTE
        const recipients = await UserModel.find({
            $or: [
                { role: 'sr-dste' },
                { role: 'dste' },
                { role: 'adste', teamId: sender.teamId }
            ]
        });

        const recipientData = recipients.map(r => ({
            name: r.name,
            role: r.role,
            email: r.email,
            phone: r.phone
        }));

        // 3. Save to DB
        const alert = await SOSAlertModel.create({
            senderId: sender.id,
            senderName: sender.name,
            senderRole: sender.role,
            teamId: sender.teamId,
            message: message || "Emergency SOS Triggered!",
            recipients: recipientData
        });

        // 4. Send Real Emails
        const emailSubject = `🚨 EMERGENCY SOS ALERT: ${sender.name} (${sender.role.toUpperCase()})`;
        const emailHtml = `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 2px solid #ef4444; border-radius: 10px;">
                <h2 style="color: #ef4444; margin-top: 0;">🚨 EMERGENCY SOS ALERT</h2>
                <p>An emergency SOS alert has been triggered by:</p>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Name:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${sender.name}</td></tr>
                    <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Role:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${sender.role.toUpperCase()}</td></tr>
                    <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Designation:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${sender.sub}</td></tr>
                    <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Phone:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${sender.phone}</td></tr>
                </table>
                <div style="background-color: #fee2e2; padding: 15px; border-radius: 5px; margin-top: 20px;">
                    <strong>Message:</strong><br/>
                    ${message || "Emergency SOS Triggered!"}
                </div>
                <p style="font-size: 12px; color: #666; margin-top: 20px;">
                    This alert was sent at ${new Date().toLocaleString()}. Please take immediate action.
                </p>
            </div>
        `;

        // Dispatch Email
        // DEMO MODE: Temporarily send to verified email only to bypass Resend sandbox
        const emailResult = await sendEmail({
            to: ["irenechrispaul17@gmail.com"], // Hardcoded for demo - will send to all recipients in production
            subject: emailSubject,
            html: emailHtml
        });

        // 6. Update Audit Trail & Final Response
        if (emailResult.success) {
            await SOSAlertModel.findByIdAndUpdate(alert.id, { status: 'sent' });

            // Send optional confirmation to sender (async) - also to verified email in demo mode
            sendEmail({
                to: ["irenechrispaul17@gmail.com"], // Demo mode
                subject: `SOS Alert Confirmation - ${alert.id}`,
                html: `<p>Your SOS alert has been received and dispatched to ${recipientData.length} recipients in the ${sender.division} hierarchy.</p>`
            }).catch(e => console.error('Sender confirmation email failed', e));

            return NextResponse.json({
                success: true,
                alertId: alert.id,
                recipientCount: recipientData.length
            });
        } else {
            await SOSAlertModel.findByIdAndUpdate(alert.id, {
                status: 'failed',
                errorMessage: emailResult.error
            });
            return NextResponse.json({
                error: 'SOS triggered but email delivery failed. Dashboard alerts are active.',
                alertId: alert.id,
                details: emailResult.error
            }, { status: 502 });
        }

    } catch (error: any) {
        console.error('SOS Fatal API Error:', error);
        return NextResponse.json({ error: 'Failed to process SOS alert system' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const role = searchParams.get('role');
        const teamId = searchParams.get('teamId');

        // Fetch alerts from the last 12 hours that include this recipient role
        const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);

        let query: any = {
            timestamp: { $gte: twelveHoursAgo },
            "recipients.role": role
        };

        // If it's an ADSTE, only show alerts for their specific team
        if (role === 'adste' && teamId) {
            query.teamId = teamId;
        }

        const alerts = await SOSAlertModel.find(query).sort({ timestamp: -1 });

        return NextResponse.json(alerts);
    } catch (error) {
        console.error('Error fetching SOS alerts:', error);
        return NextResponse.json({ error: 'Failed to fetch alerts' }, { status: 500 });
    }
}

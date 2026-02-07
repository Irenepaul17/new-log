import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import UserModel from '@/app/models/User';
import SOSAlertModel from '@/app/models/SOSAlert';

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

        // 4. Simulate Notifications (Email & SMS)
        console.log(`\n🚨 SOS ALERT TRIGGERED BY ${sender.name} (${sender.role}) 🚨`);
        console.log(`Message: ${message}`);
        console.log(`Notifying ${recipients.length} authorities:`);

        recipientData.forEach(r => {
            console.log(`- [${r.role.toUpperCase()}] ${r.name}: Sending Email to ${r.email} and SMS to ${r.phone}...`);
            // Here you would integrate with Nodemailer or Twilio in a real production environment
            // transporter.sendMail(...)
            // twilio.messages.create(...)
        });
        console.log(`--------------------------------------------------\n`);

        return NextResponse.json({
            success: true,
            alertId: alert.id,
            recipientCount: recipients.length
        });

    } catch (error) {
        console.error('SOS request error:', error);
        return NextResponse.json({ error: 'Failed to process SOS alert' }, { status: 500 });
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

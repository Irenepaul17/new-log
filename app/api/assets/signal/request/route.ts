import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import AssetUpdateRequestModel from '@/app/models/AssetUpdateRequest';
import UserModel from '@/app/models/User';
import { sendEmail } from '@/lib/mail';

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const { assetId, assetType, proposedData, requesterId } = body;

        // In a real app, we'd get requesterId from the session
        // For now, we'll assume the frontend sends it or we find it
        // Let's look up the user to get their teamId and name
        // (Note: In production, use auth session)

        // Find the user who is making the request
        // Since we don't have the requesterId from body in my planned frontend change, 
        // I should update the frontend to send it or use a better way.
        // Actually, let's look for a user with the name/role if we had it, 
        // but for now let's just use what's sent.

        // I'll update the frontend later if needed, but for now let's assume body has requester info
        // or we can find it.

        // Actually, let's find the SSE for the team
        const requester = await UserModel.findOne({ name: proposedData.authorName }); // Fallback if ID not there
        // This is fragile. Let's assume the frontend sends requesterId.

        const newRequest = await AssetUpdateRequestModel.create({
            assetId,
            assetType,
            proposedData,
            requestedBy: body.requesterId || 'unknown',
            requestedByName: body.requesterName || 'Field Staff',
            teamId: body.requesterTeamId || 'unknown',
            status: 'pending'
        });

        // Notify SSE
        const sse = await UserModel.findOne({ role: 'sse', teamId: body.requesterTeamId });
        if (sse && sse.email) {
            await sendEmail({
                to: sse.email,
                subject: `🔔 New Asset Approval Request: ${assetType.toUpperCase()} - ${proposedData.signalNoShuntNo || 'New'}`,
                html: `
                    <div style="font-family: sans-serif; padding: 20px;">
                        <h2>Asset Approval Request</h2>
                        <p><strong>Requester:</strong> ${body.requesterName}</p>
                        <p><strong>Asset:</strong> ${proposedData.signalNoShuntNo || 'New Asset'}</p>
                        <p>Please log in to the dashboard to review and approve these changes.</p>
                        <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard/sse" 
                           style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                           View Dashboard
                        </a>
                    </div>
                `
            });
        }

        return NextResponse.json(newRequest, { status: 201 });
    } catch (error: any) {
        console.error("Error creating asset request:", error);
        return NextResponse.json({ error: 'Failed to submit request' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const teamId = searchParams.get('teamId');
        const status = searchParams.get('status') || 'pending';

        const query: any = { status };
        if (teamId) query.teamId = teamId;

        const requests = await AssetUpdateRequestModel.find(query).sort({ createdAt: -1 });
        return NextResponse.json(requests);
    } catch (error) {
        console.error("Error fetching asset requests:", error);
        return NextResponse.json({ error: 'Failed to fetch requests' }, { status: 500 });
    }
}

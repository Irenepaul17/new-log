import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import AssetUpdateRequestModel from '@/app/models/AssetUpdateRequest';
import SignalAssetModel from '@/app/models/SignalAsset';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        const body = await request.json();
        const { action, comments } = body;

        const assetRequest = await AssetUpdateRequestModel.findById(id);
        if (!assetRequest) {
            return NextResponse.json({ error: 'Request not found' }, { status: 404 });
        }

        if (action === 'approve') {
            const { assetId, proposedData } = assetRequest;

            if (assetId) {
                // Update existing asset
                await SignalAssetModel.findByIdAndUpdate(assetId, { $set: proposedData });
            } else {
                // Create new asset
                await SignalAssetModel.create(proposedData);
            }

            assetRequest.status = 'approved';
            if (comments) assetRequest.comments = comments;
            await assetRequest.save();

            return NextResponse.json({ message: 'Request approved and asset updated successfully' });
        } else if (action === 'reject') {
            assetRequest.status = 'rejected';
            assetRequest.comments = comments || 'Rejected by SSE';
            await assetRequest.save();

            return NextResponse.json({ message: 'Request rejected' });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error: any) {
        console.error("Error processing asset request:", error);
        return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import SignalAssetModel from '@/app/models/SignalAsset';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        const body = await request.json();

        const updatedAsset = await SignalAssetModel.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true }
        );

        if (!updatedAsset) {
            return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
        }

        const response = {
            ...updatedAsset.toObject(),
            id: updatedAsset._id.toString()
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error("Error updating Signal asset:", error);
        return NextResponse.json({ error: 'Failed to update asset' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;

        const deletedAsset = await SignalAssetModel.findByIdAndDelete(id);

        if (!deletedAsset) {
            return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Asset deleted successfully' });
    } catch (error) {
        console.error("Error deleting Signal asset:", error);
        return NextResponse.json({ error: 'Failed to delete asset' }, { status: 500 });
    }
}

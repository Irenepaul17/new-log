import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import EIAssetModel from '@/app/models/EIAsset';

export async function GET() {
    try {
        await dbConnect();

        const eiCount = await EIAssetModel.countDocuments();

        return NextResponse.json({
            ei: eiCount,
            points: 0,
            signals: 0,
            trackCircuits: 0,
            axleCounters: 0
        });
    } catch (error) {
        console.error("Error fetching asset stats:", error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}

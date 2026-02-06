import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import EIAssetModel from '@/app/models/EIAsset';
import PointAssetModel from '@/app/models/PointAsset';
import SignalAssetModel from '@/app/models/SignalAsset';
import TrackCircuitAssetModel from '@/app/models/TrackCircuitAsset';

export async function GET() {
    try {
        await dbConnect();

        const recentDate = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const [
            eiCount, pointCount, signalCount, tcCount,
            recentEiCount, recentPointCount, recentSignalCount, recentTcCount
        ] = await Promise.all([
            EIAssetModel.countDocuments(),
            PointAssetModel.countDocuments(),
            SignalAssetModel.countDocuments(),
            TrackCircuitAssetModel.countDocuments(),
            EIAssetModel.countDocuments({ createdAt: { $gte: recentDate } }),
            PointAssetModel.countDocuments({ createdAt: { $gte: recentDate } }),
            SignalAssetModel.countDocuments({ createdAt: { $gte: recentDate } }),
            TrackCircuitAssetModel.countDocuments({ createdAt: { $gte: recentDate } }),
        ]);

        return NextResponse.json({
            ei: eiCount,
            points: pointCount,
            signals: signalCount,
            trackCircuits: tcCount,
            recent: {
                ei: recentEiCount,
                points: recentPointCount,
                signals: recentSignalCount,
                trackCircuits: recentTcCount,
            }
        });
    } catch (error) {
        console.error("Error fetching asset stats:", error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}

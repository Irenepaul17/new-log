import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import EIAssetModel from '@/app/models/EIAsset';
import PointAssetModel from '@/app/models/PointAsset';
import SignalAssetModel from '@/app/models/SignalAsset';
import TrackCircuitAssetModel from '@/app/models/TrackCircuitAsset';
import AxleCounterAssetModel from '@/app/models/AxleCounterAsset';

export async function GET() {
    try {
        await dbConnect();

        const recentDate = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const [
            eiCount, pointCount, signalCount, tcCount, acCount,
            recentEiCount, recentPointCount, recentSignalCount, recentTcCount, recentAcCount
        ] = await Promise.all([
            EIAssetModel.countDocuments(),
            PointAssetModel.countDocuments(),
            SignalAssetModel.countDocuments(),
            TrackCircuitAssetModel.countDocuments(),
            AxleCounterAssetModel.countDocuments(),
            EIAssetModel.countDocuments({ createdAt: { $gte: recentDate } }),
            PointAssetModel.countDocuments({ createdAt: { $gte: recentDate } }),
            SignalAssetModel.countDocuments({ createdAt: { $gte: recentDate } }),
            TrackCircuitAssetModel.countDocuments({ createdAt: { $gte: recentDate } }),
            AxleCounterAssetModel.countDocuments({ createdAt: { $gte: recentDate } })
        ]);

        return NextResponse.json({
            ei: eiCount,
            points: pointCount,
            signals: signalCount,
            trackCircuits: tcCount,
            axleCounters: acCount,
            recent: {
                ei: recentEiCount,
                points: recentPointCount,
                signals: recentSignalCount,
                trackCircuits: recentTcCount,
                axleCounters: recentAcCount
            }
        });
    } catch (error) {
        console.error("Error fetching asset stats:", error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}

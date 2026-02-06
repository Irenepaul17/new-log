import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import PointAssetModel from '@/app/models/PointAsset';

export async function GET(request: Request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const station = searchParams.get('station');
        const section = searchParams.get('section');
        const search = searchParams.get('search');

        const query: any = {};
        if (station) query.station = new RegExp(station, 'i');
        if (section) query.sseSection = new RegExp(section, 'i');
        if (search) {
            query.$or = [
                { station: new RegExp(search, 'i') },
                { sseSection: new RegExp(search, 'i') },
                { pointNo: new RegExp(search, 'i') },
                { pointMachineSlNo: new RegExp(search, 'i') },
            ];
        }

        const skip = (page - 1) * limit;

        const [rawAssets, total] = await Promise.all([
            PointAssetModel.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
            PointAssetModel.countDocuments(query)
        ]);

        // Transform _id to id for frontend compatibility
        const assets = rawAssets.map(asset => ({
            ...asset.toObject(),
            id: asset._id.toString()
        }));

        return NextResponse.json({
            data: assets,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error("Error fetching Point assets:", error);
        return NextResponse.json({ error: 'Failed to fetch assets' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();

        // Basic duplicate check (Station + Point No)
        const existing = await PointAssetModel.findOne({
            station: body.station,
            pointNo: body.pointNo
        });

        if (existing) {
            return NextResponse.json(
                { error: `Point asset ${body.pointNo} already exists for station ${body.station}` },
                { status: 409 }
            );
        }

        const newAsset = await PointAssetModel.create(body);
        const response = {
            ...newAsset.toObject(),
            id: newAsset._id.toString()
        };
        return NextResponse.json(response, { status: 201 });
    } catch (error) {
        console.error("Error creating Point asset:", error);
        return NextResponse.json({ error: 'Failed to create asset' }, { status: 500 });
    }
}

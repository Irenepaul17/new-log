import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import SignalAssetModel from '@/app/models/SignalAsset';

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
        if (station) query.stationAutoSection = new RegExp(station, 'i');
        if (section) query.section = new RegExp(section, 'i');
        if (search) {
            query.$or = [
                { stationAutoSectionLcIbs: new RegExp(search, 'i') },
                { section: new RegExp(search, 'i') },
                { signalNoShuntNo: new RegExp(search, 'i') },
                { signalType: new RegExp(search, 'i') },
                { route: new RegExp(search, 'i') },
            ];
        }

        const skip = (page - 1) * limit;

        const [rawAssets, total] = await Promise.all([
            SignalAssetModel.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
            SignalAssetModel.countDocuments(query)
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
        console.error("Error fetching Signal assets:", error);
        return NextResponse.json({ error: 'Failed to fetch assets' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();

        // Basic duplicate check (Section + Signal No)
        const existing = await SignalAssetModel.findOne({
            section: body.section,
            signalNoShuntNo: body.signalNoShuntNo
        });

        if (existing) {
            return NextResponse.json(
                { error: `Signal asset ${body.signalNoShuntNo} already exists for section ${body.section}` },
                { status: 409 }
            );
        }

        const newAsset = await SignalAssetModel.create(body);
        const response = {
            ...newAsset.toObject(),
            id: newAsset._id.toString()
        };
        return NextResponse.json(response, { status: 201 });
    } catch (error) {
        console.error("Error creating Signal asset:", error);
        return NextResponse.json({ error: 'Failed to create asset' }, { status: 500 });
    }
}

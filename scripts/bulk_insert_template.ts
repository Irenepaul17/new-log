import mongoose from 'mongoose';
import SignalAssetModel from '../app/models/SignalAsset';
import PointAssetModel from '../app/models/PointAsset';
import EIAssetModel from '../app/models/EIAsset';
import TrackCircuitAssetModel from '../app/models/TrackCircuitAsset';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Error: MONGODB_URI is not defined in .env.local');
    process.exit(1);
}

/**
 * PASTE YOUR DATA HERE
 */
const assetsToImport: any[] = [];

async function run() {
    const type = process.argv[2]?.replace('--type=', '') || 'signal';

    if (assetsToImport.length === 0) {
        console.warn('No data found in assetsToImport array. Please paste your data first!');
        return;
    }

    try {
        console.log(`Connecting to MongoDB for ${type} import...`);
        await mongoose.connect(MONGODB_URI!);

        let result;
        if (type === 'signal') {
            result = await SignalAssetModel.insertMany(assetsToImport);
        } else if (type === 'point') {
            result = await PointAssetModel.insertMany(assetsToImport);
        } else if (type === 'ei') {
            result = await EIAssetModel.insertMany(assetsToImport);
        } else if (type === 'track-circuit') {
            result = await TrackCircuitAssetModel.insertMany(assetsToImport);
        } else {
            throw new Error('Invalid type. Use --type=signal, --type=point, --type=ei, or --type=track-circuit');
        }

        console.log(`Successfully imported ${result.length} assets!`);

    } catch (error) {
        console.error('Import failed:', error);
    } finally {
        await mongoose.disconnect();
    }
}

run();

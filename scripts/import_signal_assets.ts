import mongoose from 'mongoose';
import SignalAssetModel from '@/app/models/SignalAsset';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Error: MONGODB_URI is not defined in .env.local');
    process.exit(1);
}

// THE DATA TO IMPORT
// Replace this array with your actual data
const assetsToImport = [
    {
        "sno": "1",
        "section": "MAS",
        "stationAutoSectionLcIbs": "MAS",
        "route": "A",
        "signalNoShuntNo": "1",
        "signalType": "STARTER",
        "lhsRhs": "RHS",
        "smmsAssetCreated": "TRUE",
        "assetApprovedByInChargeSSE": "TRUE",
        "rg": { "make": "TILAL", "type": "LED", "slNo": "4997", "dom": "2023-01-01", "doi": "2023-06-01", "qty": 1 },
        "hg": { "make": "RTV", "type": "LED", "slNo": "3095", "dom": "2023-01-01", "doi": "2023-06-01", "qty": 1 },
        "aspect2": "YES",
        "co": "YES",
        "routeConfig": "YES"
    }
];

async function importAssets() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI!);
        console.log('Connected successfully.');

        console.log(`Starting import of ${assetsToImport.length} assets...`);

        // Using insertMany for speed and schema validation
        const result = await SignalAssetModel.insertMany(assetsToImport);

        console.log(`Successfully imported ${result.length} assets!`);
    } catch (error) {
        console.error('Import failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB.');
    }
}

importAssets();


import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function testFiltering() {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) throw new Error('MONGODB_URI not found');

    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const monthStr = '2026-02';
    const [year, month] = monthStr.split('-').map(Number);
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    console.log(`Testing range: ${start.toISOString()} to ${end.toISOString()}`);

    const count = await mongoose.connection.db.collection('workreports').countDocuments({
        createdAt: { $gte: start, $lt: end }
    });

    console.log(`Found ${count} reports for ${monthStr}`);

    await mongoose.disconnect();
}

testFiltering().catch(console.error);

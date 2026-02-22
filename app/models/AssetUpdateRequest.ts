import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAssetUpdateRequest extends Document {
    assetId: string | null; // null if new asset
    assetType: 'signal' | 'points' | 'ei' | 'track_circuit';
    requestedBy: string;
    requestedByName: string;
    teamId: string;
    proposedData: any;
    status: 'pending' | 'approved' | 'rejected';
    comments?: string;
    createdAt: Date;
    updatedAt: Date;
}

const AssetUpdateRequestSchema: Schema = new Schema({
    assetId: { type: String, default: null },
    assetType: { type: String, required: true, enum: ['signal', 'points', 'ei', 'track_circuit'] },
    requestedBy: { type: String, required: true },
    requestedByName: { type: String, required: true },
    teamId: { type: String, required: true },
    proposedData: { type: Schema.Types.Mixed, required: true },
    status: { type: String, required: true, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    comments: { type: String }
}, {
    timestamps: true
});

const AssetUpdateRequestModel: Model<IAssetUpdateRequest> =
    mongoose.models.AssetUpdateRequest || mongoose.model<IAssetUpdateRequest>('AssetUpdateRequest', AssetUpdateRequestSchema);

export default AssetUpdateRequestModel;

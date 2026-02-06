import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAxleCounterAsset extends Document {
    sseSection: string;
    station: string;
    axleCounterNo: string;
    type: string; // SSDAC, MSDAC, etc.
    make: string;
    sectionType: string; // Point, Block, etc.
    dateOfInstallation: string;
    finacialYear: string;

    // Technical Details
    numberOfSensors: string;
    sensor1Location: string;
    sensor2Location: string;
    vduMakeModel: string;

    // Connectivity
    connectivityType: string; // Cable, OFC
    redundancyStatus: string;

    // Maintenance
    lastReplacementDate: string;
    status: string;

    createdAt: Date;
    updatedAt: Date;
}

const AxleCounterAssetSchema: Schema = new Schema({
    sseSection: { type: String, required: true },
    station: { type: String, required: true },
    axleCounterNo: { type: String, required: true },
    type: { type: String, default: "" },
    make: { type: String, default: "" },
    sectionType: { type: String, default: "" },
    dateOfInstallation: { type: String, default: "" },
    finacialYear: { type: String, default: "" },
    numberOfSensors: { type: String, default: "" },
    sensor1Location: { type: String, default: "" },
    sensor2Location: { type: String, default: "" },
    vduMakeModel: { type: String, default: "" },
    connectivityType: { type: String, default: "" },
    redundancyStatus: { type: String, default: "" },
    lastReplacementDate: { type: String, default: "" },
    status: { type: String, default: "" }
}, {
    timestamps: true
});

const AxleCounterAssetModel: Model<IAxleCounterAsset> =
    mongoose.models.AxleCounterAsset || mongoose.model<IAxleCounterAsset>('AxleCounterAsset', AxleCounterAssetSchema);

export default AxleCounterAssetModel;

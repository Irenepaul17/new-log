import mongoose, { Schema, Model } from "mongoose";

export interface SOSAlert {
    id: string;
    senderId: string;
    senderName: string;
    senderRole: string;
    teamId?: string;
    message: string;
    timestamp: Date;
    recipients: {
        name: string;
        role: string;
        email: string;
        phone: string;
    }[];
}

const SOSAlertSchema = new Schema<SOSAlert>(
    {
        senderId: { type: String, required: true },
        senderName: { type: String, required: true },
        senderRole: { type: String, required: true },
        teamId: { type: String },
        message: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        recipients: [{
            name: { type: String, required: true },
            role: { type: String, required: true },
            email: { type: String, required: true },
            phone: { type: String, required: true }
        }]
    },
    {
        toJSON: {
            transform: function (doc, ret: any) {
                ret.id = ret._id.toString();
                delete ret._id;
                delete ret.__v;
            }
        },
        timestamps: true
    }
);

const SOSAlertModel: Model<SOSAlert> = mongoose.models.SOSAlert || mongoose.model<SOSAlert>("SOSAlert", SOSAlertSchema);

export default SOSAlertModel;

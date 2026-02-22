import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import WorkReportModel from "@/app/models/WorkReport";
import ComplaintModel from "@/app/models/Complaint";
import UserModel from "@/app/models/User";

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");
        const role = searchParams.get("role");

        if (!userId || !role) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const query: any = {};

        // Role-based filtering logic
        if (role === 'sse') {
            const user = await UserModel.findById(userId);
            if (user?.teamId) {
                query.teamId = user.teamId;
            }
        } else if (role === 'je' || role === 'technician') {
            query.userId = userId;
        } else if (role === 'adste') {
            const user = await UserModel.findById(userId);
            if (user?.teamId) {
                query.teamId = user.teamId;
            }
        }

        // Fetch counts for ALL time to show in sidebar (simplified for now)
        const [workLogCount, failureCount] = await Promise.all([
            WorkReportModel.countDocuments(query),
            ComplaintModel.countDocuments(query)
        ]);

        return NextResponse.json({
            workLogs: workLogCount,
            failures: failureCount
        });
    } catch (error) {
        console.error("Failed to fetch sidebar counts:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

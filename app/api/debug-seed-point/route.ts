import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import PointAssetModel from '@/app/models/PointAsset';

export async function GET() {
    try {
        await dbConnect();

        // Data from user request
        // 618	TRL	TI	101A	Main Line	1 IN 12	220	YES	PTJ	Partially Provided	7/6/2025	NO		NA		4/7/2024	10/7/2024	NO	NO	Not Available			3551	2022	S&T PTJ	4/7/2024	22040153	Normal	GLOBE SCOTT	28/10A-12A	L-3	T Type	PROVIDED	PROVIDED	PROVIDED	NON-RDSO	1	N/A	N/A	N/A	N/A	N/A	N/A	N/A	N/A	Double End Point	YES

        const data = {
            sseSection: "TRL", // Assuming TRL is section
            station: "TI",     // Assuming TI is station
            pointNo: "101A",
            lineType: "Main Line",
            layout: "1 IN 12",
            throw: "220MM", // Mapped 220 -> 220MM
            facingPoint: "Yes",
            antiTheftNut: "Yes", // Mapped PTJ -> Yes (since make is provided)
            antiTheftNutStatus: "Partial", // Mapped Partially Provided -> Partial
            dateInstallAntiTheftFasteners: "2025-06-07", // 7/6/2025

            pBracketProtection: "No",
            dateInstallPBracketProtection: "",
            lostMotionStretcherBarProtection: "No", // Mapped NA -> No
            dateInstallLostMotionProtection: "",

            lastDatePointInsulationReplaced: "2024-07-04", // 4/7/2024
            duePointInsulationReplacement: "2024-07-10", // 10/7/2024

            michuangWaterLogging: "No",
            fullySubmergedHeavyRain: "No",

            galvanizedGroundConnections: "No", // Mapped Not Available -> No
            dateProvisionGalvanizedRoddings: "",
            fyProvisionGalvanizedRoddings: "",

            pointMachineSlNo: "3551",
            yearOfManufacture: "2022",
            make: "S&T PTJ",
            installedDate: "2024-07-04", // 4/7/2024

            motorSlNo: "22040153",
            motorType: "NORMAL", // Mapped Normal -> NORMAL
            motorMake: "GLOBE SCOTT",

            atKm: "28/10A-12A",
            locationNumber: "L-3",
            ssdInsulation: "T type",

            msFlatTieBarDetails: "Yes", // PROVIDED -> Yes
            ercMkIIIReplacement: "Yes", // PROVIDED -> Yes
            insulatingLinerReplacement: "Yes", // PROVIDED -> Yes

            circuit: "NON-RDSO",
            noOfQBCARelays: 1,
            pointGroupParallelingDone: "Yes",

            endType: "Double End", // Double End Point -> Double End

            // Dates to N/A or empty
            wcrABDateManufacture: "N/A",
            wcrABDateTested: "N/A",
            wczr1DateManufacture: "N/A",
            wczr1DateTested: "N/A",
            nwczrDateManufacture: "N/A",
            nwczrDateTested: "N/A",
            rwczrDateManufacture: "N/A",
            rwczrDateTested: "N/A"
        };

        // Check exist
        const exists = await PointAssetModel.findOne({ pointNo: data.pointNo, station: data.station });
        if (exists) {
            return NextResponse.json({ message: 'Asset already exists', data: exists });
        }

        const newAsset = await PointAssetModel.create(data);
        return NextResponse.json({ message: 'Seeded successfully', data: newAsset });

    } catch (error) {
        console.error("Error seeding:", error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

import mongoose from 'mongoose';
import SignalAssetModel from '../app/models/SignalAsset';
import PointAssetModel from '../app/models/PointAsset';
import EIAssetModel from '../app/models/EIAsset';
import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { parse } from 'csv-parse/sync';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Error: MONGODB_URI is not defined');
    process.exit(1);
}

const SIGNAL_CSV = "/Users/irenepaul/code/monitoring-system-next/Signal Asset for App.csv";
const POINT_CSV = "/Users/irenepaul/code/monitoring-system-next/Point Asset for App.csv";
const EI_CSV = "/Users/irenepaul/code/monitoring-system-next/Copy of Copy of EI Details.csv";

async function importSignalAssets() {
    console.log('--- Importing Signal Assets ---');
    if (!fs.existsSync(SIGNAL_CSV)) {
        console.warn(`File not found: ${SIGNAL_CSV}`);
        return;
    }
    const content = fs.readFileSync(SIGNAL_CSV, 'utf-8');
    const rows = parse(content, {
        skip_empty_lines: true,
        from_line: 5 // Data starts from row 5
    });

    const assets = rows.map((row: string[]) => ({
        sno: row[0],
        section: row[1],
        stationAutoSectionLcIbs: row[2],
        route: row[3],
        signalNoShuntNo: row[4],
        signalType: row[5],
        lhsRhs: row[6],
        smmsAssetCreated: row[7],
        assetApprovedByInChargeSSE: row[8],
        rg: { make: row[10], type: row[11], slNo: row[12], dom: row[13], doi: row[14], qty: row[15] },
        hg: { make: row[16], type: row[17], slNo: row[18], dom: row[19], doi: row[20], qty: row[21] },
        hhg: { make: row[22], type: row[23], slNo: row[24], dom: row[25], doi: row[26], qty: row[27] },
        dg: { make: row[28], type: row[29], slNo: row[30], dom: row[31], doi: row[32], qty: row[33] },
        shunt: { make: row[34], type: row[35], slNo: row[36], dom: row[37], doi: row[38], qty: row[39] },
        routeEquipment: { make: row[40], type: row[41], slNo: row[42], dom: row[43], doi: row[44], qty: row[45] },
        amarker: { make: row[46], type: row[47], slNo: row[48], dom: row[49], doi: row[50], qty: row[51] },
        callingon: { make: row[52], type: row[53], slNo: row[54], dom: row[55], doi: row[56], qty: row[57] },
        aspect2: row[59],
        aspect3: row[60],
        aspect4: row[61],
        shuntConfig: row[62],
        ind: row[63],
        onPost: row[64],
        co: row[65],
        routeConfig: row[66],
        home: row[67],
        starter: row[68],
        ib: row[69],
        gatesig: row[70],
        auto: row[71],
        retroReflectiveSignalNo: row[72]
    })).filter((a: any) => a.section && a.signalNoShuntNo);

    if (assets.length > 0) {
        await SignalAssetModel.deleteMany({});
        await SignalAssetModel.insertMany(assets);
        console.log(`Imported ${assets.length} Signal assets.`);
    }
}

async function importPointAssets() {
    console.log('--- Importing Point Assets ---');
    if (!fs.existsSync(POINT_CSV)) {
        console.warn(`File not found: ${POINT_CSV}`);
        return;
    }
    const content = fs.readFileSync(POINT_CSV, 'utf-8');
    const rows = parse(content, {
        skip_empty_lines: true,
        from_line: 2
    });

    const assets = rows.map((row: string[]) => ({
        sseSection: row[1],
        station: row[2],
        pointNo: row[3],
        lineType: row[4],
        layout: row[5],
        throw: row[6],
        facingPoint: row[7],
        antiTheftNut: row[8],
        antiTheftNutStatus: row[9],
        dateInstallAntiTheftFasteners: row[10],
        pBracketProtection: row[11],
        dateInstallPBracketProtection: row[12],
        lostMotionStretcherBarProtection: row[13],
        dateInstallLostMotionProtection: row[14],
        lastDatePointInsulationReplaced: row[15],
        duePointInsulationReplacement: row[16],
        michuangWaterLogging: row[17],
        fullySubmergedHeavyRain: row[18],
        galvanizedGroundConnections: row[19],
        dateProvisionGalvanizedRoddings: row[20],
        fyProvisionGalvanizedRoddings: row[21],
        pointMachineSlNo: row[22],
        yearOfManufacture: row[23],
        make: row[24],
        installedDate: row[25],
        motorSlNo: row[26],
        motorType: row[27],
        motorMake: row[28],
        atKm: row[29],
        locationNumber: row[30],
        ssdInsulation: row[31],
        msFlatTieBarDetails: row[32],
        ercMkIIIReplacement: row[33],
        insulatingLinerReplacement: row[34],
        circuit: row[35],
        noOfQBCARelays: row[36],
        pointGroupParallelingDone: row[37],
        wcrABDateManufacture: row[38],
        wcrABDateTested: row[39],
        wczr1DateManufacture: row[40],
        wczr1DateTested: row[41],
        nwczrDateManufacture: row[42],
        nwczrDateTested: row[43],
        rwczrDateManufacture: row[44],
        rwczrDateTested: row[45],
        endType: row[46]
    })).filter((a: any) => a.sseSection && a.pointNo);

    if (assets.length > 0) {
        await PointAssetModel.deleteMany({});
        await PointAssetModel.insertMany(assets);
        console.log(`Imported ${assets.length} Point assets.`);
    }
}

async function importEIAssets() {
    console.log('--- Importing EI Assets ---');
    if (!fs.existsSync(EI_CSV)) {
        console.warn(`File not found: ${EI_CSV}`);
        return;
    }
    const content = fs.readFileSync(EI_CSV, 'utf-8');
    const rows = parse(content, {
        skip_empty_lines: true,
        from_line: 3
    });

    const assets = rows.map((row: string[]) => ({
        serialNumber: row[0],
        sseSection: row[1],
        station: row[2],
        stationAutoSection: row[3],
        section: row[4],
        route: row[5],
        make: row[6],
        numberOfRoutes: row[7],
        state: row[8],
        dateOfInstallation: row[9],
        financialYear: row[10],
        centralisedDistributed: row[11],
        numberOfOCs: row[12],
        rdsoTypicalCircuit: row[13],
        powerCableRedundancy: row[14],
        tdcRedundantPowerCable: row[15],
        systemType: row[16],
        vdu1MakeModel: row[17],
        vdu1ManufactureDate: row[18],
        vdu1LastReplacementDate: row[19],
        vdu2MakeModel: row[20],
        vdu2ManufactureDate: row[21],
        vdu2LastReplacementDate: row[22],
        pc1MakeModel: row[23],
        pc1ManufactureDate: row[24],
        pc1LastReplacementDate: row[25],
        pc2MakeModel: row[26],
        pc2ManufactureDate: row[27],
        pc2LastReplacementDate: row[28],
        vdu1PowerSupply: row[29],
        vdu2PowerSupply: row[30],
        tempFilesDeletionStatus: row[31],
        standbyMode: row[32],
        eiVersion: row[33],
        latestUpgrade: row[34],
        upgradeStatus: row[35],
        upgradeDate: row[36],
        mtRelayRoomStatus: row[37],
        warrantyAmcStatus: row[38],
        warrantyAmcFrom: row[39],
        warrantyAmcTo: row[40],
        acProvider: row[41],
        batteryChargerType: row[42],
        emergencyRouteReleaseCounter: row[43],
        registerAvailability: row[44],
        emrcKeyHolder: row[45],
        codalLife: row[46],
        networkSwitchStatus: row[47],
        commLinkIndication: row[48],
        systemFailureIndication: row[49],
        amcLastDate: row[50],
        amcFrom: row[51],
        amcTo: row[52],
        amcWorkDone: row[53],
        amcDeficiency: row[54],
        spareCardDetails: row[55],
        spareCardTestDate: row[56],
        emergencyPanelAvailability: row[57],
        emergencyPanelProvisionDate: row[58],
        emergencyPanelStatus: row[59]
    })).filter((a: any) => a.sseSection && a.station);

    if (assets.length > 0) {
        await EIAssetModel.deleteMany({});
        await EIAssetModel.insertMany(assets);
        console.log(`Imported ${assets.length} EI assets.`);
    }
}

async function run() {
    try {
        await mongoose.connect(MONGODB_URI!);
        console.log('Connected to MongoDB.');

        await importSignalAssets();
        await importPointAssets();
        await importEIAssets();

        console.log('All imports completed successfully!');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await mongoose.disconnect();
    }
}

run();

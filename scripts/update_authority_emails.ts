import dbConnect from "../lib/mongodb";
import UserModel from "../app/models/User";

async function updateEmails() {
    try {
        await dbConnect();
        console.log("Connected to MongoDB");

        const authorities = ["sr-dste", "dste", "adste"];
        const realEmails = ["irenepaul17303@gmail.com", "irenechrispaul17@gmail.com"];

        // Update SR-DSTE
        await UserModel.updateMany(
            { role: "sr-dste" },
            { $set: { email: realEmails[0] } }
        );
        console.log(`Updated SR-DSTE to ${realEmails[0]}`);

        // Update DSTE
        await UserModel.updateMany(
            { role: "dste" },
            { $set: { email: realEmails[1] } }
        );
        console.log(`Updated DSTE to ${realEmails[1]}`);

        // Update all ADSTEs
        await UserModel.updateMany(
            { role: "adste" },
            { $set: { email: realEmails[0] } }
        );
        console.log(`Updated ADSTEs to ${realEmails[0]}`);

        console.log("\n✅ Authority emails updated successfully!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Failed to update emails:", error);
        process.exit(1);
    }
}

updateEmails();

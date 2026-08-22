import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const SOURCE_URI = process.env.MONGODB_URI || "mongodb+srv://shashankjangidofficial_db_user:p0S1kh0dzM0WdQd0@cluster0.e4cvux4.mongodb.net/?appName=Cluster0";

export async function duplicateAllDatabases(targetUri: string) {
  console.log("🚀 Starting database duplication...");
  console.log(`Source URI: ${SOURCE_URI.replace(/:[^:@]+@/, ":****@")}`);
  console.log(`Target URI: ${targetUri.replace(/:[^:@]+@/, ":****@")}`);

  const sourceClient = new MongoClient(SOURCE_URI);
  const targetClient = new MongoClient(targetUri);

  try {
    await sourceClient.connect();
    console.log("✅ Connected to Source MongoDB cluster.");

    await targetClient.connect();
    console.log("✅ Connected to Target MongoDB cluster.");

    const targetDbs = ["dpsi_main", "dpsi_gallery", "dpsi_tc"];

    for (const dbName of targetDbs) {
      console.log(`\n📦 Duplicating Database: [${dbName}]...`);
      const srcDb = sourceClient.db(dbName);
      const dstDb = targetClient.db(dbName);

      const collections = await srcDb.listCollections().toArray();

      for (const colInfo of collections) {
        const colName = colInfo.name;
        if (colName.startsWith("system.")) continue;

        const srcCol = srcDb.collection(colName);
        const dstCol = dstDb.collection(colName);

        const docs = await srcCol.find({}).toArray();
        console.log(`  📄 Collection [${colName}]: Found ${docs.length} document(s) in source.`);

        if (docs.length > 0) {
          await dstCol.deleteMany({});
          const insertResult = await dstCol.insertMany(docs);
          console.log(`     ✅ Inserted ${insertResult.insertedCount} document(s) into target [${dbName}.${colName}].`);
        }

        // Copy indexes safely
        try {
          const indexes = await srcCol.indexes();
          let recreatedCount = 0;
          for (const idx of indexes) {
            if (idx.name === "_id_") continue;
            const key = idx.key;
            const options: any = { name: idx.name, background: true };
            if (typeof (idx as any).unique === "boolean") options.unique = (idx as any).unique;
            if (typeof (idx as any).sparse === "boolean") options.sparse = (idx as any).sparse;
            if (typeof (idx as any).expireAfterSeconds === "number") options.expireAfterSeconds = (idx as any).expireAfterSeconds;

            await dstCol.createIndex(key, options);
            recreatedCount++;
          }
          console.log(`     🔑 Recreated ${recreatedCount} custom index(es) on [${colName}].`);
        } catch (idxErr: any) {
          console.warn(`     ⚠️ Index creation notice for [${colName}]:`, idxErr.message);
        }
      }
    }

    console.log("\n🎉 Database duplication completed successfully!");
    return { success: true };
  } catch (err: any) {
    console.error("❌ Database duplication failed:", err);
    throw err;
  } finally {
    await sourceClient.close();
    await targetClient.close();
  }
}

const targetUriArg = process.argv[2];
if (targetUriArg) {
  duplicateAllDatabases(targetUriArg)
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

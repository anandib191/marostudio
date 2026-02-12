import mongoose from "mongoose";
import logger from "./logger.js";
import dns from "dns/promises";

export const diagnosticsMongoDB = async () => {
  console.log("\n🔍 MongoDB Connectivity Diagnostics\n");

  try {
    // Extract hostname from connection string
    const uri = process.env.MONGODB_URI;
    const match = uri.match(/mongodb\+srv:\/\/[^@]+@([^\/]+)/);
    const hostname = match ? match[1] : "unknown";

    console.log(`📍 Target Host: ${hostname}`);
    console.log(`📍 Full URI: ${uri.substring(0, 60)}...`);
    console.log(`📍 Current Node Env: ${process.env.NODE_ENV}`);
    console.log(`📍 Network Check:`);

    // Try DNS resolution
    try {
      const addresses = await dns.resolve4(hostname);
      console.log(`   ✅ DNS Resolution: SUCCESS - ${addresses.join(", ")}`);
    } catch (dnsError) {
      console.log(`   ❌ DNS Resolution: FAILED - ${dnsError.message}`);
      console.log(`   💡 Possible causes:`);
      console.log(`      - Network/Firewall blocking DNS`);
      console.log(`      - MongoDB Atlas cluster doesn't exist`);
      console.log(`      - Invalid credentials in connection string`);
      return false;
    }

    // Try connection with longer timeout
    console.log(`\n⏳ Testing MongoDB Connection (30s timeout)...`);
    const testConn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 30000,
      connectTimeoutMS: 30000,
    });

    console.log(`✅ Connection: SUCCESS`);
    console.log(`✅ Database: ${testConn.connection.name}`);
    console.log(`✅ Host: ${testConn.connection.host}`);

    await testConn.disconnect();
    console.log(`✅ Disconnected successfully\n`);
    return true;
  } catch (error) {
    console.error(`❌ Connection Failed: ${error.message}\n`);
    console.log(`💡 Troubleshooting steps:`);
    console.log(`   1. Verify MongoDB Atlas cluster is running`);
    console.log(
      `   2. Check IP whitelist in MongoDB Atlas (add 0.0.0.0/0 for development)`,
    );
    console.log(`   3. Verify credentials in MONGODB_URI are correct`);
    console.log(`   4. Check your internet/VPN connection`);
    console.log(`   5. Try connecting with longer timeout (current: 5000ms)\n`);
    return false;
  }
};

// Run diagnostics
diagnosticsMongoDB().then((success) => {
  process.exit(success ? 0 : 1);
});

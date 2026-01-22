#!/usr/bin/env node
/**
 * Create admin user(s) in the database.
 * Run from server folder: node scripts/create-admin.js <email1> [email2 ...]
 * Or: npm run create-admin -- admin@example.com
 *
 * After running, add the same email(s) to ADMIN_EMAILS in your .env
 * so they can receive OTP and sign in as admin at /admin/login.
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import connectDB from '../config/db.js';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

const emails = process.argv.slice(2).map((e) => String(e).toLowerCase().trim()).filter(Boolean);

if (emails.length === 0) {
  console.log(`
Usage: node scripts/create-admin.js <email1> [email2 ...]

Example:
  node scripts/create-admin.js admin@yourcompany.com
  npm run create-admin -- admin@yourcompany.com other@yourcompany.com

From the server folder, or: npm run create-admin -- <email>
`);
  process.exit(1);
}

async function main() {
  if (!process.env.MONGODB_URI) {
    console.error('Error: MONGODB_URI is not set. Create a .env file in the server folder with MONGODB_URI.');
    process.exit(1);
  }

  await connectDB();

  const results = [];
  for (const email of emails) {
    try {
      const doc = await User.findOneAndUpdate(
        { email },
        { $set: { email, role: 'admin', isVerified: true } },
        { upsert: true, new: true }
      );
      results.push({ email, done: true, id: doc._id.toString() });
    } catch (err) {
      results.push({ email, done: false, error: err.message });
    }
  }

  for (const r of results) {
    if (r.done) {
      console.log(`✓ Admin created/updated: ${r.email}`);
    } else {
      console.error(`✗ Failed for ${r.email}: ${r.error}`);
    }
  }

  const ok = results.every((r) => r.done);
  if (ok && results.length) {
    console.log(`
Next: add these email(s) to ADMIN_EMAILS in your server .env so they can log in via OTP:

  ADMIN_EMAILS=${emails.join(',')}
`);
  }

  process.exit(ok ? 0 : 1);
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});

import db from '../../../config/db/queries.ts';
import dotenv from 'dotenv';

dotenv.config();

export default async function seedAliceAdmin() {
  const alice = await db.addUser({
    email: 'alice.admin@example.com',
    name: 'Alice Admin',
    password: process.env.PASSWORD_ALICE_ADMIN as string,
    role: 'ADMIN',
    userType: 'OTHER',
  });

  await db.createAuditLog(alice.id, 'User signed up');
  await db.createAuditLog(alice.id, 'Admin privileges granted');
}

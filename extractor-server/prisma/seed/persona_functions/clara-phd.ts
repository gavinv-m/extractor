import db from '../../../config/db/queries.ts';
import dotenv from 'dotenv';

dotenv.config();

export default async function seedClaraPhd() {
  const clara = await db.addUser({
    email: 'clara.phd@example.com',
    name: 'Clara PhD',
    password: process.env.PASSWORD_CLARA_PHD as string,
    role: 'USER',
    userType: 'STUDENT',
    studentType: 'PHD',
  });

  await db.createAuditLog(clara.id, 'User signed up');

  const subscription = await db.createSubscription(
    clara.id,
    'PRO',
    'ACTIVE',
    new Date(),
    new Date(new Date().setMonth(new Date().getMonth() + 1))
  );

  // Cancel the subscription while keeping endDate (grace period)
  await db.updateSubscription(subscription.id, { status: 'CANCELLED' });

  await db.createAuditLog(clara.id, 'User cancelled subscription');
}

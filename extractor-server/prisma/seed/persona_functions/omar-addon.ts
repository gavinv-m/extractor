import db from '../../../config/db/queries.ts';
import dotenv from 'dotenv';
import normaliseDate from '../../../utils/date.ts';

dotenv.config();

export default async function seedOmarAddOn() {
  const omar = await db.addUser({
    email: 'omar.addon@example.com',
    name: 'Omar AddOn',
    password: process.env.PASSWORD_OMAR_ADDON as string,
    role: 'USER',
    userType: 'PROFESSIONAL',
    professionalField: 'ENGINEERING',
  });

  await db.createAuditLog(omar.id, 'User signed up');

  const startDate = new Date();
  const endDate = new Date(new Date().setMonth(startDate.getMonth() + 1));

  await db.createSubscription(omar.id, 'PRO', 'ACTIVE', startDate, endDate);

  const subscriptionStart = normaliseDate(startDate);

  await db.createMonthlyUsage(omar.id, subscriptionStart, 1000);

  await db.createAuditLog(
    omar.id,
    'Monthly usage initialized with 1000 pages remaining'
  );

  // NEW: Give Omar 500 add-on pages
  await db.createAddOn(omar.id, 500);

  await db.createAuditLog(omar.id, 'Added 500 add-on pages to account');

  await db.createPayment({
    userId: omar.id,
    amount: 4.99,
    status: 'COMPLETED',
    type: 'ADD_ON',
  });
}

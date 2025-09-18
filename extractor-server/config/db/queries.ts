import bcrypt from 'bcryptjs';
import prisma from './client.ts';

/* Queries sorted alphabetically:
    addUser,
    consumeAddOnPages,
    createAddOn,
    createAuditLog, 
    createAzureQuery,
    createMonthlyUsage,
    createPayment,
    createSubscription,
    getUserByEmail,
    getUserById,
    incrementPagesUsed,
    updateAzureQuery,
    updateMonthlyUsage,
    updatePayment,
    updateSubscription, 
    updateUser
*/

const addUser = async (data: any) => {
  try {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const userData: any = {
      email: data.email,
      name: data.name,
      password: hashedPassword,
      role: data.role,
    };

    if (data.userType) {
      userData.userType = data.userType;

      if (data.userType === 'STUDENT' && data.studentType) {
        userData.studentType = data.studentType;
      }

      if (data.userType === 'PROFESSIONAL' && data.professionalField) {
        userData.professionalField = data.professionalField;
      }
    }

    return await prisma.user.create({ data: userData });
  } catch (error) {
    console.error('Failed to add user:', error);
    throw new Error('Could not create user');
  }
};

// Kept it thin, the logic to assess if we can consume from a certain id will live elsewhere
const consumeAddOnPages = async (addOnId: string, consume: number) => {
  return prisma.addOn.update({
    where: { id: addOnId },
    data: {
      pagesUsed: { increment: consume },
      pagesRemaining: { decrement: consume },
    },
  });
};

const createAddOn = async (userId: string, pages: number) => {
  return prisma.addOn.create({
    data: {
      userId,
      pages,
      pagesUsed: 0,
      pagesRemaining: pages,
    },
  });
};

const createAuditLog = async (
  userId: string | null,
  action: string,
  meta?: any
) => {
  return prisma.auditLog.create({
    data: {
      userId,
      action,
      meta,
    },
  });
};

const createAzureQuery = async (
  userId: string,
  data: Partial<{
    numPages: number;
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
  }>
) => {
  return prisma.azureQuery.create({
    data: {
      userId,
      numPages: data.numPages ?? 0,
      status: data.status ?? 'PENDING',
    },
  });
};

const createMonthlyUsage = async (
  userId: string,
  month: Date,
  pagesRemaining: number
) => {
  return prisma.monthlyUsage.create({
    data: {
      userId,
      month,
      pagesUsed: 0,
      pagesRemaining, // set the starting quota based on plan
    },
  });
};

// TODO: Find out interplay between frontend, and processor
const createPayment = async (data: {
  userId: string;
  amount: number;
  currency?: string; // defaults to USD
  status?: 'PENDING' | 'COMPLETED' | 'FAILED';
  type?: 'SUBSCRIPTION' | 'ADD_ON';
}) => {
  return prisma.payment.create({
    data: {
      userId: data.userId,
      amount: data.amount,
      currency: data.currency ?? 'USD',
      status: data.status ?? 'PENDING',
      type: data.type ?? 'SUBSCRIPTION',
    },
  });
};

const createSubscription = async (
  userId: string,
  plan: 'FREE' | 'PRO' | 'PREMIUM' | 'BUSINESS',
  status: 'ACTIVE' | 'INACTIVE' | 'CANCELLED' = 'ACTIVE', // default to ACTIVE
  startDate: Date,
  endDate: Date
) => {
  return prisma.subscription.create({
    data: {
      userId,
      plan,
      startDate: startDate,
      endDate: endDate,
      status,
    },
  });
};

const getUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

const getUserById = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
  });
};

// Pages used this month
const incrementPagesUsed = async (userId: string, pages: number) => {
  // Find the latest MonthlyUsage row whose subscription period has started
  const usage = await prisma.monthlyUsage.findFirst({
    where: {
      userId,
      month: { lte: new Date() }, // start date <= today
    },
    orderBy: { month: 'desc' }, // latest active period
  });

  if (!usage) {
    throw new Error('No active monthly usage found for this user.');
  }

  // Increment pagesUsed
  return prisma.monthlyUsage.update({
    where: { id: usage.id },
    data: {
      pagesUsed: { increment: pages },
    },
  });
};

const updateAzureQuery = async (
  id: string,
  data: Partial<{
    numPages: number;
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
  }>
) => {
  return prisma.azureQuery.update({
    where: { id },
    data,
  });
};

const updateMonthlyUsage = async (
  userId: string,
  month: Date,
  pagesUsed: number
) => {
  const usage = await prisma.monthlyUsage.findFirst({
    where: { userId, month },
  });

  if (!usage) throw new Error('Monthly usage not found');

  return prisma.monthlyUsage.update({
    where: { id: usage.id },
    data: {
      pagesUsed: usage.pagesUsed + pagesUsed,
      pagesRemaining: usage.pagesRemaining - pagesUsed,
    },
  });
};

const updatePayment = async (
  id: string,
  data: Partial<{
    amount: number;
    currency: string;
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
    type: 'SUBSCRIPTION' | 'ADD_ON';
  }>
) => {
  return prisma.payment.update({
    where: { id },
    data,
  });
};

const updateSubscription = async (
  id: string,
  data: Partial<{
    plan: 'FREE' | 'PRO' | 'PREMIUM' | 'BUSINESS';
    status: 'ACTIVE' | 'INACTIVE' | 'CANCELLED';
    startDate: Date;
    endDate: Date;
  }>
) => {
  return prisma.subscription.update({
    where: { id },
    data,
  });
};

const updateUser = async (id: string, data: any) => {
  try {
    const updateData: any = {};

    if (data.email) updateData.email = data.email;
    if (data.name) updateData.name = data.name;

    if (data.password) {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      updateData.password = hashedPassword;
    }

    if (data.userType) {
      updateData.userType = data.userType;

      if (data.userType === 'STUDENT' && data.studentType) {
        updateData.studentType = data.studentType;
        updateData.professionalField = null; // clear if switching types
      }

      if (data.userType === 'PROFESSIONAL' && data.professionalField) {
        updateData.professionalField = data.professionalField;
        updateData.studentType = null; // clear if switching types
      }
    }

    return await prisma.user.update({
      where: { id },
      data: updateData,
    });
  } catch (error) {
    console.error(error);
    throw new Error('Failed to update user');
  }
};

const db = {
  addUser,
  consumeAddOnPages,
  createAddOn,
  createAuditLog,
  createAzureQuery,
  createMonthlyUsage,
  createPayment,
  createSubscription,
  getUserByEmail,
  getUserById,
  incrementPagesUsed,
  updateAzureQuery,
  updateMonthlyUsage,
  updatePayment,
  updateSubscription,
  updateUser,
};

export default db;

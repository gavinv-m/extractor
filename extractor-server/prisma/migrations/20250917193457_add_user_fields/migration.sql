/*
  Warnings:

  - Added the required column `userType` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."UserType" AS ENUM ('STUDENT', 'PROFESSIONAL', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."StudentType" AS ENUM ('UNDERGRAD', 'PHD');

-- CreateEnum
CREATE TYPE "public"."ProfessionalField" AS ENUM ('FINANCE', 'LEGAL', 'ENGINEERING', 'MEDICAL');

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "professionalField" "public"."ProfessionalField",
ADD COLUMN     "studentType" "public"."StudentType",
ADD COLUMN     "userType" "public"."UserType" NOT NULL;

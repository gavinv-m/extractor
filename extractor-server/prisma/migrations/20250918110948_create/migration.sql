/*
  Warnings:

  - Added the required column `pagesRemaining` to the `MonthlyUsage` table without a default value. This is not possible if the table is not empty.
  - Made the column `endDate` on table `Subscription` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."MonthlyUsage" ADD COLUMN     "pagesRemaining" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Subscription" ALTER COLUMN "endDate" SET NOT NULL;

-- CreateTable
CREATE TABLE "public"."AddOn" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "pages" INTEGER NOT NULL,
    "pagesUsed" INTEGER NOT NULL DEFAULT 0,
    "pagesRemaining" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AddOn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PageVisit" (
    "id" BIGSERIAL NOT NULL,
    "userId" TEXT,
    "clientId" TEXT,
    "path" TEXT NOT NULL,
    "referrer" TEXT,
    "visitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userAgent" TEXT,
    "ip" TEXT,

    CONSTRAINT "PageVisit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PageVisit_path_idx" ON "public"."PageVisit"("path");

-- CreateIndex
CREATE INDEX "PageVisit_visitedAt_idx" ON "public"."PageVisit"("visitedAt");

-- CreateIndex
CREATE INDEX "PageVisit_userId_idx" ON "public"."PageVisit"("userId");

-- CreateIndex
CREATE INDEX "PageVisit_clientId_idx" ON "public"."PageVisit"("clientId");

-- AddForeignKey
ALTER TABLE "public"."AddOn" ADD CONSTRAINT "AddOn_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PageVisit" ADD CONSTRAINT "PageVisit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

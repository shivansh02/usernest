/*
  Warnings:

  - You are about to drop the `InviteCode` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[inviteCode]` on the table `Organisation` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "InviteCode" DROP CONSTRAINT "InviteCode_organisationId_fkey";

-- AlterTable
ALTER TABLE "Organisation" ADD COLUMN     "inviteCode" TEXT;

-- DropTable
DROP TABLE "InviteCode";

-- CreateIndex
CREATE UNIQUE INDEX "Organisation_inviteCode_key" ON "Organisation"("inviteCode");

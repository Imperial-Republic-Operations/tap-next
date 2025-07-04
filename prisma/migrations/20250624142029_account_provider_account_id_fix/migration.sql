/*
  Warnings:

  - You are about to alter the column `providerAccountId` on the `Account` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `BigInt`.

*/
-- AlterTable
ALTER TABLE `Account` MODIFY `providerAccountId` BIGINT NOT NULL;

/*
  Warnings:

  - You are about to alter the column `nexusId` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `BigInt`.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `name` VARCHAR(191) NULL,
    MODIFY `nexusId` BIGINT NOT NULL;

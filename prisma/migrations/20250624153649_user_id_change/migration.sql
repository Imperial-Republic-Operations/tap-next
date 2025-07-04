/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `avatarLink` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Account` DROP FOREIGN KEY `Account_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Character` DROP FOREIGN KEY `Character_userId_fkey`;

-- DropForeignKey
ALTER TABLE `CodeGen` DROP FOREIGN KEY `CodeGen_userId_fkey`;

-- DropForeignKey
ALTER TABLE `GameDocument` DROP FOREIGN KEY `GameDocument_authorId_fkey`;

-- DropForeignKey
ALTER TABLE `Session` DROP FOREIGN KEY `Session_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Team` DROP FOREIGN KEY `Team_adminId_fkey`;

-- DropForeignKey
ALTER TABLE `UserSettings` DROP FOREIGN KEY `UserSettings_userId_fkey`;

-- DropIndex
DROP INDEX `Character_userId_fkey` ON `Character`;

-- DropIndex
DROP INDEX `CodeGen_userId_fkey` ON `CodeGen`;

-- DropIndex
DROP INDEX `GameDocument_authorId_fkey` ON `GameDocument`;

-- DropIndex
DROP INDEX `User_username_key` ON `User`;

-- AlterTable
ALTER TABLE `Account` MODIFY `userId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Character` MODIFY `userId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `CodeGen` MODIFY `userId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `GameDocument` MODIFY `authorId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Session` MODIFY `userId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Team` MODIFY `adminId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `User` DROP PRIMARY KEY,
    DROP COLUMN `avatarLink`,
    DROP COLUMN `username`,
    ADD COLUMN `image` VARCHAR(191) NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `UserSettings` MODIFY `userId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_name_key` ON `User`(`name`);

-- AddForeignKey
ALTER TABLE `UserSettings` ADD CONSTRAINT `UserSettings_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Account` ADD CONSTRAINT `Account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Team` ADD CONSTRAINT `Team_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Character` ADD CONSTRAINT `Character_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CodeGen` ADD CONSTRAINT `CodeGen_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GameDocument` ADD CONSTRAINT `GameDocument_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

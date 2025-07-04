-- AlterTable
ALTER TABLE `Account` MODIFY `providerAccountId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `nexusId` VARCHAR(191) NOT NULL;

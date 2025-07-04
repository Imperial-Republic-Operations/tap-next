-- DropForeignKey
ALTER TABLE `Member` DROP FOREIGN KEY `Member_positionId_fkey`;

-- DropForeignKey
ALTER TABLE `Member` DROP FOREIGN KEY `Member_rankId_fkey`;

-- DropIndex
DROP INDEX `Member_positionId_fkey` ON `Member`;

-- DropIndex
DROP INDEX `Member_rankId_fkey` ON `Member`;

-- AlterTable
ALTER TABLE `Member` MODIFY `rankId` BIGINT NULL,
    MODIFY `positionId` BIGINT NULL;

-- AddForeignKey
ALTER TABLE `Member` ADD CONSTRAINT `Member_rankId_fkey` FOREIGN KEY (`rankId`) REFERENCES `Rank`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Member` ADD CONSTRAINT `Member_positionId_fkey` FOREIGN KEY (`positionId`) REFERENCES `Position`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

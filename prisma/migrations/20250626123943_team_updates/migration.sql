-- DropForeignKey
ALTER TABLE `Team` DROP FOREIGN KEY `Team_adminId_fkey`;

-- AlterTable
ALTER TABLE `Team` MODIFY `adminId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `_teamMember` (
    `A` BIGINT NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_teamMember_AB_unique`(`A`, `B`),
    INDEX `_teamMember_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Team` ADD CONSTRAINT `Team_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_teamMember` ADD CONSTRAINT `_teamMember_A_fkey` FOREIGN KEY (`A`) REFERENCES `Team`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_teamMember` ADD CONSTRAINT `_teamMember_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

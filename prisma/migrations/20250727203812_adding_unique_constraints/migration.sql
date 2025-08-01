/*
  Warnings:

  - A unique constraint covering the columns `[level,orderId]` on the table `ForceTitle` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[characterId,organizationId]` on the table `Member` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,parentId]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,organizationId]` on the table `Position` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,organizationId]` on the table `Rank` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `ForceTitle_level_orderId_key` ON `ForceTitle`(`level`, `orderId`);

-- CreateIndex
CREATE UNIQUE INDEX `Member_characterId_organizationId_key` ON `Member`(`characterId`, `organizationId`);

-- CreateIndex
CREATE UNIQUE INDEX `Organization_name_parentId_key` ON `Organization`(`name`, `parentId`);

-- CreateIndex
CREATE UNIQUE INDEX `Position_name_organizationId_key` ON `Position`(`name`, `organizationId`);

-- CreateIndex
CREATE UNIQUE INDEX `Rank_name_organizationId_key` ON `Rank`(`name`, `organizationId`);

-- AddForeignKey
ALTER TABLE `Account` ADD CONSTRAINT `Account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

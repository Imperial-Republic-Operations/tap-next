-- AlterTable
ALTER TABLE `Character` ADD COLUMN `background` TEXT NULL,
    MODIFY `age` INTEGER NULL,
    MODIFY `appearance` TEXT NULL,
    MODIFY `habits` TEXT NULL,
    MODIFY `hobbies` TEXT NULL,
    MODIFY `strengths` TEXT NULL,
    MODIFY `talents` TEXT NULL,
    MODIFY `weaknesses` TEXT NULL;

-- CreateTable
CREATE TABLE `CharacterInteraction` (
    `interaction` VARCHAR(766) NOT NULL,
    `characterId` BIGINT NOT NULL,

    PRIMARY KEY (`characterId`, `interaction`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CharacterPreviousPosition` (
    `position` VARCHAR(191) NOT NULL,
    `characterId` BIGINT NOT NULL,

    PRIMARY KEY (`characterId`, `position`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CharacterEducation` (
    `education` VARCHAR(191) NOT NULL,
    `characterId` BIGINT NOT NULL,

    PRIMARY KEY (`characterId`, `education`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CharacterHonor` (
    `honor` VARCHAR(191) NOT NULL,
    `characterId` BIGINT NOT NULL,

    PRIMARY KEY (`characterId`, `honor`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CharacterGoal` (
    `goal` VARCHAR(766) NOT NULL,
    `characterId` BIGINT NOT NULL,

    PRIMARY KEY (`characterId`, `goal`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CharacterInteraction` ADD CONSTRAINT `CharacterInteraction_characterId_fkey` FOREIGN KEY (`characterId`) REFERENCES `Character`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CharacterPreviousPosition` ADD CONSTRAINT `CharacterPreviousPosition_characterId_fkey` FOREIGN KEY (`characterId`) REFERENCES `Character`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CharacterEducation` ADD CONSTRAINT `CharacterEducation_characterId_fkey` FOREIGN KEY (`characterId`) REFERENCES `Character`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CharacterHonor` ADD CONSTRAINT `CharacterHonor_characterId_fkey` FOREIGN KEY (`characterId`) REFERENCES `Character`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CharacterGoal` ADD CONSTRAINT `CharacterGoal_characterId_fkey` FOREIGN KEY (`characterId`) REFERENCES `Character`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

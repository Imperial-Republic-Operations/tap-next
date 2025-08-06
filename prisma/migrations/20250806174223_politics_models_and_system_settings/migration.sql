-- CreateTable
CREATE TABLE `Senator` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `seatType` ENUM('NONE', 'ELECTED', 'APPOINTED') NOT NULL DEFAULT 'NONE',
    `planetId` BIGINT NOT NULL,
    `committeeId` BIGINT NULL,
    `userId` VARCHAR(191) NULL,

    UNIQUE INDEX `Senator_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SenateCommittee` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `color` VARCHAR(7) NULL,
    `temporary` BOOLEAN NOT NULL DEFAULT false,
    `chairId` BIGINT NULL,
    `viceChairId` BIGINT NULL,

    UNIQUE INDEX `SenateCommittee_chairId_key`(`chairId`),
    UNIQUE INDEX `SenateCommittee_viceChairId_key`(`viceChairId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SenateSettings` (
    `id` INTEGER NOT NULL DEFAULT 1,
    `supremeRulerPositionId` BIGINT NOT NULL,
    `presidentPositionId` BIGINT NOT NULL,
    `vicePresidentPositionId` BIGINT NOT NULL,

    UNIQUE INDEX `SenateSettings_supremeRulerPositionId_key`(`supremeRulerPositionId`),
    UNIQUE INDEX `SenateSettings_presidentPositionId_key`(`presidentPositionId`),
    UNIQUE INDEX `SenateSettings_vicePresidentPositionId_key`(`vicePresidentPositionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HighCouncilSettings` (
    `id` INTEGER NOT NULL DEFAULT 1,
    `chairmanPositionId` BIGINT NOT NULL,
    `viceChairmanPositionId` BIGINT NOT NULL,
    `highCouncilorPositionId` BIGINT NOT NULL,
    `honoraryHighCouncilorPositionId` BIGINT NOT NULL,

    UNIQUE INDEX `HighCouncilSettings_chairmanPositionId_key`(`chairmanPositionId`),
    UNIQUE INDEX `HighCouncilSettings_viceChairmanPositionId_key`(`viceChairmanPositionId`),
    UNIQUE INDEX `HighCouncilSettings_highCouncilorPositionId_key`(`highCouncilorPositionId`),
    UNIQUE INDEX `HighCouncilSettings_honoraryHighCouncilorPositionId_key`(`honoraryHighCouncilorPositionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Senator` ADD CONSTRAINT `Senator_planetId_fkey` FOREIGN KEY (`planetId`) REFERENCES `Planet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Senator` ADD CONSTRAINT `Senator_committeeId_fkey` FOREIGN KEY (`committeeId`) REFERENCES `SenateCommittee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Senator` ADD CONSTRAINT `Senator_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SenateCommittee` ADD CONSTRAINT `SenateCommittee_chairId_fkey` FOREIGN KEY (`chairId`) REFERENCES `Senator`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SenateCommittee` ADD CONSTRAINT `SenateCommittee_viceChairId_fkey` FOREIGN KEY (`viceChairId`) REFERENCES `Senator`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SenateSettings` ADD CONSTRAINT `SenateSettings_supremeRulerPositionId_fkey` FOREIGN KEY (`supremeRulerPositionId`) REFERENCES `Position`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SenateSettings` ADD CONSTRAINT `SenateSettings_presidentPositionId_fkey` FOREIGN KEY (`presidentPositionId`) REFERENCES `Position`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SenateSettings` ADD CONSTRAINT `SenateSettings_vicePresidentPositionId_fkey` FOREIGN KEY (`vicePresidentPositionId`) REFERENCES `Position`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HighCouncilSettings` ADD CONSTRAINT `HighCouncilSettings_chairmanPositionId_fkey` FOREIGN KEY (`chairmanPositionId`) REFERENCES `Position`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HighCouncilSettings` ADD CONSTRAINT `HighCouncilSettings_viceChairmanPositionId_fkey` FOREIGN KEY (`viceChairmanPositionId`) REFERENCES `Position`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HighCouncilSettings` ADD CONSTRAINT `HighCouncilSettings_highCouncilorPositionId_fkey` FOREIGN KEY (`highCouncilorPositionId`) REFERENCES `Position`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HighCouncilSettings` ADD CONSTRAINT `HighCouncilSettings_honoraryHighCouncilorPositionId_fkey` FOREIGN KEY (`honoraryHighCouncilorPositionId`) REFERENCES `Position`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

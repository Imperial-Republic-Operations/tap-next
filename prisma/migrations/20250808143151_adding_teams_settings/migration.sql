-- CreateTable
CREATE TABLE `TeamsSettings` (
    `id` INTEGER NOT NULL DEFAULT 1,
    `characterTeamId` BIGINT NOT NULL,
    `moderationTeamId` BIGINT NOT NULL,
    `forceTeamId` BIGINT NOT NULL,
    `operationsTeamId` BIGINT NOT NULL,
    `publicationTeamId` BIGINT NOT NULL,

    UNIQUE INDEX `TeamsSettings_characterTeamId_key`(`characterTeamId`),
    UNIQUE INDEX `TeamsSettings_moderationTeamId_key`(`moderationTeamId`),
    UNIQUE INDEX `TeamsSettings_forceTeamId_key`(`forceTeamId`),
    UNIQUE INDEX `TeamsSettings_operationsTeamId_key`(`operationsTeamId`),
    UNIQUE INDEX `TeamsSettings_publicationTeamId_key`(`publicationTeamId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TeamsSettings` ADD CONSTRAINT `TeamsSettings_characterTeamId_fkey` FOREIGN KEY (`characterTeamId`) REFERENCES `Team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeamsSettings` ADD CONSTRAINT `TeamsSettings_moderationTeamId_fkey` FOREIGN KEY (`moderationTeamId`) REFERENCES `Team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeamsSettings` ADD CONSTRAINT `TeamsSettings_forceTeamId_fkey` FOREIGN KEY (`forceTeamId`) REFERENCES `Team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeamsSettings` ADD CONSTRAINT `TeamsSettings_operationsTeamId_fkey` FOREIGN KEY (`operationsTeamId`) REFERENCES `Team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeamsSettings` ADD CONSTRAINT `TeamsSettings_publicationTeamId_fkey` FOREIGN KEY (`publicationTeamId`) REFERENCES `Team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

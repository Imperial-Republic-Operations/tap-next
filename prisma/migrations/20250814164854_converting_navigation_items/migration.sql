-- CreateTable
CREATE TABLE `navigation_items` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `titleKey` VARCHAR(191) NULL,
    `title` VARCHAR(191) NOT NULL,
    `path` VARCHAR(191) NOT NULL,
    `exact` BOOLEAN NOT NULL DEFAULT false,
    `location` ENUM('HEADER_MAIN', 'HEADER_DROPDOWN', 'SIDEBAR', 'BREADCRUMB_ONLY') NOT NULL,
    `context` VARCHAR(191) NULL,
    `parentId` BIGINT NULL,
    `orderIndex` INTEGER NOT NULL DEFAULT 0,
    `accessType` ENUM('OPEN', 'AUTHENTICATED', 'ROLE', 'TEAM', 'ROLE_AND_TEAM', 'CUSTOM') NOT NULL,
    `accessRole` ENUM('SYSTEM_ADMIN', 'ADMIN', 'ASSISTANT_ADMIN', 'GAME_MODERATOR', 'STAFF', 'PLAYER', 'BANNED') NULL,
    `accessTeam` ENUM('CHARACTER', 'MODERATION', 'FORCE', 'OPERATIONS', 'PUBLICATION') NULL,
    `accessOverrideRole` ENUM('SYSTEM_ADMIN', 'ADMIN', 'ASSISTANT_ADMIN', 'GAME_MODERATOR', 'STAFF', 'PLAYER', 'BANNED') NULL,
    `customAccessFunction` VARCHAR(191) NULL,
    `badgeSource` VARCHAR(191) NULL,
    `breadcrumbResolver` VARCHAR(191) NULL,
    `devOnly` BOOLEAN NOT NULL DEFAULT false,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `navigation_items` ADD CONSTRAINT `navigation_items_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `navigation_items`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

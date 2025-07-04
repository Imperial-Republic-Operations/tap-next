-- CreateTable
CREATE TABLE `User` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `nexusId` BIGINT NOT NULL,
    `avatarLink` VARCHAR(191) NULL,
    `role` ENUM('SYSTEM_ADMIN', 'ADMIN', 'ASSISTANT_ADMIN', 'GAME_MODERATOR', 'STAFF', 'PLAYER', 'BANNED') NOT NULL DEFAULT 'PLAYER',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_nexusId_key`(`nexusId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserSettings` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `language` VARCHAR(191) NOT NULL DEFAULT 'en',
    `dateFormat` ENUM('MMDDYYYY', 'DDMMYYYY', 'YYYYMMDD') NOT NULL DEFAULT 'YYYYMMDD',
    `timeFormat` ENUM('TWELVE', 'TWENTY_FOUR') NOT NULL DEFAULT 'TWENTY_FOUR',
    `emailNotifications` BOOLEAN NOT NULL DEFAULT false,
    `userId` BIGINT NOT NULL,
    `defaultCharacterId` BIGINT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `UserSettings_userId_key`(`userId`),
    UNIQUE INDEX `UserSettings_defaultCharacterId_key`(`defaultCharacterId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Team` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `abbreviation` VARCHAR(191) NOT NULL,
    `currentSequence` INTEGER NOT NULL DEFAULT 0,
    `adminId` BIGINT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Team_name_key`(`name`),
    UNIQUE INDEX `Team_abbreviation_key`(`abbreviation`),
    UNIQUE INDEX `Team_adminId_key`(`adminId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Organization` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `abbreviation` VARCHAR(191) NOT NULL,
    `type` ENUM('FACTION', 'BRANCH', 'DEPARTMENT', 'DIVISION', 'BUREAU', 'SECTION', 'UNIT') NOT NULL,
    `parentId` BIGINT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Rank` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `abbreviation` VARCHAR(191) NOT NULL,
    `tier` ENUM('ROYAL_THRONE', 'HIGH_COMMAND', 'COMMAND', 'OFFICER', 'ENLISTED') NOT NULL,
    `level` INTEGER NOT NULL,
    `salary` INTEGER NOT NULL DEFAULT 0,
    `organizationId` BIGINT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Position` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `exclusive` BOOLEAN NOT NULL DEFAULT true,
    `accessType` ENUM('ORGANIZATION_LEADER', 'ORGANIZATION_2IC', 'ORGANIZATION_ADMIN', 'TITLE_ONLY') NOT NULL,
    `stipend` INTEGER NOT NULL DEFAULT 0,
    `organizationId` BIGINT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SecurityClearance` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `tier` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `SecurityClearance_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Member` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `primaryMembership` BOOLEAN NOT NULL DEFAULT false,
    `characterId` BIGINT NOT NULL,
    `organizationId` BIGINT NOT NULL,
    `rankId` BIGINT NOT NULL,
    `positionId` BIGINT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Character` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `gender` ENUM('MALE', 'FEMALE') NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE', 'DECEASED', 'MISSING', 'RETIRED') NOT NULL DEFAULT 'ACTIVE',
    `currentSequence` INTEGER NOT NULL DEFAULT 0,
    `avatarLink` VARCHAR(191) NOT NULL,
    `approvalStatus` ENUM('DRAFT', 'PENDING', 'DENIED', 'APPROVED') NULL,
    `speciesId` BIGINT NOT NULL,
    `homeworldId` BIGINT NOT NULL,
    `clearanceId` BIGINT NULL,
    `userId` BIGINT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Character_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Species` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `forceProbabilityModifier` DECIMAL(65, 30) NOT NULL DEFAULT 1.0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Species_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Peerage` (
    `id` BIGINT NOT NULL,
    `peerageRank` ENUM('KINGDOM', 'KINGDOM_HEIR', 'PRINCIPALITY', 'DUCHY', 'MARQUESSATE', 'EARLDOM', 'VISCOUNTCY', 'BARONY') NULL,
    `honoraryTitle` ENUM('DOWAGER_EMPRESS', 'QUEEN_DOWAGER', 'PRINCE', 'PRINCESS', 'LORD', 'LADY', 'KNIGHT', 'DAME') NULL,
    `domainId` BIGINT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Peerage_domainId_key`(`domainId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Oversector` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Oversector_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sector` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `oversectorId` BIGINT NOT NULL,

    UNIQUE INDEX `Sector_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `System` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `sectorId` BIGINT NOT NULL,

    UNIQUE INDEX `System_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Planet` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `forceProbabilityModifier` DECIMAL(65, 30) NOT NULL DEFAULT 1.0,
    `habitable` BOOLEAN NOT NULL DEFAULT true,
    `systemId` BIGINT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Planet_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ForceProfile` (
    `id` BIGINT NOT NULL,
    `alignment` ENUM('LIGHT', 'DARK', 'NEUTRAL') NULL,
    `level` ENUM('POTENTIAL', 'INITIATE', 'STUDENT', 'KNIGHT', 'MASTER', 'GRANDMASTER') NOT NULL DEFAULT 'POTENTIAL',
    `aware` BOOLEAN NOT NULL DEFAULT false,
    `masterId` BIGINT NULL,
    `orderId` BIGINT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ForceOrder` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `alignment` ENUM('LIGHT', 'DARK', 'NEUTRAL') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ForceOrder_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ForceAbility` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `alignment` ENUM('LIGHT', 'DARK', 'NEUTRAL') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ForceAbility_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ForceTitle` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `level` ENUM('POTENTIAL', 'INITIATE', 'STUDENT', 'KNIGHT', 'MASTER', 'GRANDMASTER') NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `orderId` BIGINT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TrainingSession` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `type` ENUM('MEDITATION', 'LIGHTSABER', 'FORCE_ABILITY') NOT NULL,
    `duration` INTEGER NOT NULL,
    `completed` BOOLEAN NOT NULL,
    `notes` TEXT NULL,
    `characterId` BIGINT NOT NULL,
    `abilityId` BIGINT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Month` (
    `realMonth` ENUM('JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER') NOT NULL,
    `gameMonth` VARCHAR(191) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Month_realMonth_key`(`realMonth`),
    PRIMARY KEY (`realMonth`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Year` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `gameYear` INTEGER NOT NULL,
    `era` ENUM('UFY', 'IRY') NOT NULL,
    `current` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CodeGen` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(191) NOT NULL,
    `reason` ENUM('CHARACTER_APPROVAL', 'DOCUMENT_APPROVAL', 'OTHER') NOT NULL,
    `purpose` TEXT NOT NULL,
    `userId` BIGINT NOT NULL,
    `characterId` BIGINT NULL,
    `documentId` BIGINT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `CodeGen_documentId_key`(`documentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GameDocument` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `sequenceNumber` VARCHAR(5) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `status` ENUM('FOR_REVIEW', 'COMPLETE', 'REVOKED', 'NEW', 'IN_PROCESS', 'PERMANENT') NOT NULL,
    `teamId` BIGINT NOT NULL,
    `authorId` BIGINT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrganizationDocument` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `sequenceNumber` VARCHAR(5) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `status` ENUM('FOR_REVIEW', 'COMPLETE', 'REVOKED', 'NEW', 'IN_PROCESS', 'PERMANENT') NOT NULL,
    `viewType` ENUM('DEFAULT', 'SECURITY_CLEARANCE', 'ASSIGNEES_ONLY') NOT NULL,
    `authorId` BIGINT NOT NULL,
    `organizationId` BIGINT NOT NULL,
    `typeId` BIGINT NOT NULL,
    `listClearanceId` BIGINT NULL,
    `viewClearanceId` BIGINT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PersonalDocument` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `sequenceNumber` VARCHAR(5) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `status` ENUM('FOR_REVIEW', 'COMPLETE', 'REVOKED', 'NEW', 'IN_PROCESS', 'PERMANENT') NOT NULL,
    `authorId` BIGINT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DocumentSequence` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `currentSequence` INTEGER NOT NULL DEFAULT 0,
    `typeId` BIGINT NOT NULL,
    `organizationId` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DocumentType` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `abbreviation` VARCHAR(5) NOT NULL,
    `sequenced` BOOLEAN NOT NULL DEFAULT false,
    `useOrganization` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `DocumentType_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CreditAccount` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `type` ENUM('CHARACTER', 'ORGANIZATION') NOT NULL,
    `accountNumber` VARCHAR(191) NOT NULL,
    `balance` INTEGER NOT NULL DEFAULT 0,
    `characterId` BIGINT NULL,
    `organizationId` BIGINT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `CreditAccount_characterId_key`(`characterId`),
    UNIQUE INDEX `CreditAccount_organizationId_key`(`organizationId`),
    UNIQUE INDEX `CreditAccount_type_accountNumber_key`(`type`, `accountNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Inventory` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `type` ENUM('CHARACTER', 'ORGANIZATION') NOT NULL,
    `characterId` BIGINT NULL,
    `organizationId` BIGINT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Inventory_characterId_key`(`characterId`),
    UNIQUE INDEX `Inventory_organizationId_key`(`organizationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Item` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `quantity` INTEGER NOT NULL,
    `inventoryId` BIGINT NOT NULL,
    `modelId` BIGINT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ship` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `crewCapacity` INTEGER NOT NULL,
    `cargoCapacity` INTEGER NOT NULL,
    `passengerCapacity` INTEGER NOT NULL,
    `inventoryId` BIGINT NOT NULL,
    `modelId` BIGINT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Vehicle` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `crewCapacity` INTEGER NOT NULL,
    `cargoCapacity` INTEGER NOT NULL,
    `inventoryId` BIGINT NOT NULL,
    `modelId` BIGINT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ItemModel` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `type` ENUM('WEAPON', 'ARMOR', 'CONSUMABLE', 'MATERIAL', 'TOOL', 'KEY_ITEM', 'OTHER') NOT NULL,
    `weight` INTEGER NOT NULL,
    `stackable` BOOLEAN NOT NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ShipModel` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `manufacturer` VARCHAR(191) NOT NULL,
    `crewCapacity` INTEGER NOT NULL,
    `cargoCapacity` INTEGER NOT NULL,
    `passengerCapacity` INTEGER NOT NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VehicleModel` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `manufacturer` VARCHAR(191) NOT NULL,
    `crewCapacity` INTEGER NOT NULL,
    `cargoCapacity` INTEGER NOT NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CreditTransfer` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `amount` INTEGER NOT NULL,
    `status` ENUM('SUCCESS', 'FAILED') NOT NULL,
    `reason` TEXT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `senderId` BIGINT NOT NULL,
    `recipientId` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InventoryTransfer` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `senderId` BIGINT NOT NULL,
    `recipientId` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InventoryTransferItem` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `status` ENUM('SUCCESS', 'FAILED') NOT NULL,
    `quantity` INTEGER NULL,
    `reason` TEXT NULL,
    `transferId` BIGINT NOT NULL,
    `itemId` BIGINT NULL,
    `shipId` BIGINT NULL,
    `vehicleId` BIGINT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Award` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `abbreviation` VARCHAR(191) NOT NULL,
    `approvingAuthorityId` BIGINT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AwardTier` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `suffix` VARCHAR(191) NULL,
    `awardId` BIGINT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CharacterAward` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `dateAwarded` DATETIME(3) NOT NULL,
    `status` ENUM('NOMINATED', 'APPROVED', 'DENIED', 'AWARDED') NOT NULL DEFAULT 'NOMINATED',
    `characterId` BIGINT NOT NULL,
    `awardId` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_signedDocuments` (
    `A` BIGINT NOT NULL,
    `B` BIGINT NOT NULL,

    UNIQUE INDEX `_signedDocuments_AB_unique`(`A`, `B`),
    INDEX `_signedDocuments_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_assignedDocuments` (
    `A` BIGINT NOT NULL,
    `B` BIGINT NOT NULL,

    UNIQUE INDEX `_assignedDocuments_AB_unique`(`A`, `B`),
    INDEX `_assignedDocuments_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserSettings` ADD CONSTRAINT `UserSettings_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserSettings` ADD CONSTRAINT `UserSettings_defaultCharacterId_fkey` FOREIGN KEY (`defaultCharacterId`) REFERENCES `Character`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Team` ADD CONSTRAINT `Team_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Organization` ADD CONSTRAINT `Organization_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Organization`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rank` ADD CONSTRAINT `Rank_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `Organization`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Position` ADD CONSTRAINT `Position_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `Organization`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Member` ADD CONSTRAINT `Member_characterId_fkey` FOREIGN KEY (`characterId`) REFERENCES `Character`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Member` ADD CONSTRAINT `Member_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `Organization`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Member` ADD CONSTRAINT `Member_rankId_fkey` FOREIGN KEY (`rankId`) REFERENCES `Rank`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Member` ADD CONSTRAINT `Member_positionId_fkey` FOREIGN KEY (`positionId`) REFERENCES `Position`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Character` ADD CONSTRAINT `Character_speciesId_fkey` FOREIGN KEY (`speciesId`) REFERENCES `Species`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Character` ADD CONSTRAINT `Character_homeworldId_fkey` FOREIGN KEY (`homeworldId`) REFERENCES `Planet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Character` ADD CONSTRAINT `Character_clearanceId_fkey` FOREIGN KEY (`clearanceId`) REFERENCES `SecurityClearance`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Character` ADD CONSTRAINT `Character_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Peerage` ADD CONSTRAINT `Peerage_id_fkey` FOREIGN KEY (`id`) REFERENCES `Character`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Peerage` ADD CONSTRAINT `Peerage_domainId_fkey` FOREIGN KEY (`domainId`) REFERENCES `Planet`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sector` ADD CONSTRAINT `Sector_oversectorId_fkey` FOREIGN KEY (`oversectorId`) REFERENCES `Oversector`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `System` ADD CONSTRAINT `System_sectorId_fkey` FOREIGN KEY (`sectorId`) REFERENCES `Sector`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Planet` ADD CONSTRAINT `Planet_systemId_fkey` FOREIGN KEY (`systemId`) REFERENCES `System`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ForceProfile` ADD CONSTRAINT `ForceProfile_id_fkey` FOREIGN KEY (`id`) REFERENCES `Character`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ForceProfile` ADD CONSTRAINT `ForceProfile_masterId_fkey` FOREIGN KEY (`masterId`) REFERENCES `Character`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ForceProfile` ADD CONSTRAINT `ForceProfile_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `ForceOrder`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ForceTitle` ADD CONSTRAINT `ForceTitle_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `ForceOrder`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrainingSession` ADD CONSTRAINT `TrainingSession_characterId_fkey` FOREIGN KEY (`characterId`) REFERENCES `Character`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrainingSession` ADD CONSTRAINT `TrainingSession_abilityId_fkey` FOREIGN KEY (`abilityId`) REFERENCES `ForceAbility`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CodeGen` ADD CONSTRAINT `CodeGen_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CodeGen` ADD CONSTRAINT `CodeGen_characterId_fkey` FOREIGN KEY (`characterId`) REFERENCES `Character`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CodeGen` ADD CONSTRAINT `CodeGen_documentId_fkey` FOREIGN KEY (`documentId`) REFERENCES `GameDocument`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GameDocument` ADD CONSTRAINT `GameDocument_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `Team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GameDocument` ADD CONSTRAINT `GameDocument_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrganizationDocument` ADD CONSTRAINT `OrganizationDocument_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `Character`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrganizationDocument` ADD CONSTRAINT `OrganizationDocument_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `Organization`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrganizationDocument` ADD CONSTRAINT `OrganizationDocument_typeId_fkey` FOREIGN KEY (`typeId`) REFERENCES `DocumentType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrganizationDocument` ADD CONSTRAINT `OrganizationDocument_listClearanceId_fkey` FOREIGN KEY (`listClearanceId`) REFERENCES `SecurityClearance`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrganizationDocument` ADD CONSTRAINT `OrganizationDocument_viewClearanceId_fkey` FOREIGN KEY (`viewClearanceId`) REFERENCES `SecurityClearance`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PersonalDocument` ADD CONSTRAINT `PersonalDocument_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `Character`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DocumentSequence` ADD CONSTRAINT `DocumentSequence_typeId_fkey` FOREIGN KEY (`typeId`) REFERENCES `DocumentType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DocumentSequence` ADD CONSTRAINT `DocumentSequence_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `Organization`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CreditAccount` ADD CONSTRAINT `CreditAccount_characterId_fkey` FOREIGN KEY (`characterId`) REFERENCES `Character`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CreditAccount` ADD CONSTRAINT `CreditAccount_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `Organization`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Inventory` ADD CONSTRAINT `Inventory_characterId_fkey` FOREIGN KEY (`characterId`) REFERENCES `Character`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Inventory` ADD CONSTRAINT `Inventory_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `Organization`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_inventoryId_fkey` FOREIGN KEY (`inventoryId`) REFERENCES `Inventory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_modelId_fkey` FOREIGN KEY (`modelId`) REFERENCES `ItemModel`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ship` ADD CONSTRAINT `Ship_inventoryId_fkey` FOREIGN KEY (`inventoryId`) REFERENCES `Inventory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ship` ADD CONSTRAINT `Ship_modelId_fkey` FOREIGN KEY (`modelId`) REFERENCES `ShipModel`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vehicle` ADD CONSTRAINT `Vehicle_inventoryId_fkey` FOREIGN KEY (`inventoryId`) REFERENCES `Inventory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vehicle` ADD CONSTRAINT `Vehicle_modelId_fkey` FOREIGN KEY (`modelId`) REFERENCES `VehicleModel`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CreditTransfer` ADD CONSTRAINT `CreditTransfer_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `CreditAccount`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CreditTransfer` ADD CONSTRAINT `CreditTransfer_recipientId_fkey` FOREIGN KEY (`recipientId`) REFERENCES `CreditAccount`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InventoryTransfer` ADD CONSTRAINT `InventoryTransfer_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `Inventory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InventoryTransfer` ADD CONSTRAINT `InventoryTransfer_recipientId_fkey` FOREIGN KEY (`recipientId`) REFERENCES `Inventory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InventoryTransferItem` ADD CONSTRAINT `InventoryTransferItem_transferId_fkey` FOREIGN KEY (`transferId`) REFERENCES `InventoryTransfer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InventoryTransferItem` ADD CONSTRAINT `InventoryTransferItem_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `Item`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InventoryTransferItem` ADD CONSTRAINT `InventoryTransferItem_shipId_fkey` FOREIGN KEY (`shipId`) REFERENCES `Ship`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InventoryTransferItem` ADD CONSTRAINT `InventoryTransferItem_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `Vehicle`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Award` ADD CONSTRAINT `Award_approvingAuthorityId_fkey` FOREIGN KEY (`approvingAuthorityId`) REFERENCES `Organization`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AwardTier` ADD CONSTRAINT `AwardTier_awardId_fkey` FOREIGN KEY (`awardId`) REFERENCES `Award`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CharacterAward` ADD CONSTRAINT `CharacterAward_characterId_fkey` FOREIGN KEY (`characterId`) REFERENCES `Character`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CharacterAward` ADD CONSTRAINT `CharacterAward_awardId_fkey` FOREIGN KEY (`awardId`) REFERENCES `AwardTier`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_signedDocuments` ADD CONSTRAINT `_signedDocuments_A_fkey` FOREIGN KEY (`A`) REFERENCES `Character`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_signedDocuments` ADD CONSTRAINT `_signedDocuments_B_fkey` FOREIGN KEY (`B`) REFERENCES `OrganizationDocument`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_assignedDocuments` ADD CONSTRAINT `_assignedDocuments_A_fkey` FOREIGN KEY (`A`) REFERENCES `Character`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_assignedDocuments` ADD CONSTRAINT `_assignedDocuments_B_fkey` FOREIGN KEY (`B`) REFERENCES `OrganizationDocument`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

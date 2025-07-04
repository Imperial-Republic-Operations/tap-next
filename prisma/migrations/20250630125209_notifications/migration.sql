-- CreateTable
CREATE TABLE `Notification` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `message` VARCHAR(191) NOT NULL,
    `link` VARCHAR(191) NULL,
    `seen` BOOLEAN NOT NULL DEFAULT false,
    `read` BOOLEAN NOT NULL DEFAULT false,
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

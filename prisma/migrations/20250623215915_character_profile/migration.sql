/*
  Warnings:

  - Added the required column `age` to the `Character` table without a default value. This is not possible if the table is not empty.
  - Added the required column `appearance` to the `Character` table without a default value. This is not possible if the table is not empty.
  - Added the required column `habits` to the `Character` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hobbies` to the `Character` table without a default value. This is not possible if the table is not empty.
  - Added the required column `strengths` to the `Character` table without a default value. This is not possible if the table is not empty.
  - Added the required column `talents` to the `Character` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weaknesses` to the `Character` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Character` ADD COLUMN `age` INTEGER NOT NULL,
    ADD COLUMN `appearance` TEXT NOT NULL,
    ADD COLUMN `habits` TEXT NOT NULL,
    ADD COLUMN `hobbies` TEXT NOT NULL,
    ADD COLUMN `nexusId` BIGINT NULL,
    ADD COLUMN `strengths` TEXT NOT NULL,
    ADD COLUMN `talents` TEXT NOT NULL,
    ADD COLUMN `weaknesses` TEXT NOT NULL;

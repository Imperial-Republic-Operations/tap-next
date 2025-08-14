/*
  Warnings:

  - You are about to drop the column `context` on the `navigation_items` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `navigation_items` DROP COLUMN `context`,
    ADD COLUMN `dropdownSection` ENUM('REFERENCES', 'ADMINISTRATION') NULL;

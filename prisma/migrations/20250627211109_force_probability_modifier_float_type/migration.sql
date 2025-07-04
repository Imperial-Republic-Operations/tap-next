/*
  Warnings:

  - You are about to alter the column `forceProbabilityModifier` on the `Planet` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Double`.
  - You are about to alter the column `forceProbabilityModifier` on the `Species` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Double`.

*/
-- AlterTable
ALTER TABLE `Planet` MODIFY `forceProbabilityModifier` DOUBLE NOT NULL DEFAULT 1.0;

-- AlterTable
ALTER TABLE `Species` MODIFY `forceProbabilityModifier` DOUBLE NOT NULL DEFAULT 1.0;

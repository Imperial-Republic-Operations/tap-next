/*
  Warnings:

  - A unique constraint covering the columns `[path]` on the table `navigation_items` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `navigation_items_path_key` ON `navigation_items`(`path`);

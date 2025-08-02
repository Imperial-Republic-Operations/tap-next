/*
  Warnings:

  - A unique constraint covering the columns `[gameYear,era]` on the table `Year` will be added. If there are existing duplicate values, this will fail.

*/

DELETE y1 FROM Year y1
INNER JOIN Year y2
WHERE y1.id > y2.id
AND y1.gameYear = y2.gameYear
AND y1.era = y2.era;

-- CreateIndex
CREATE UNIQUE INDEX `Year_gameYear_era_key` ON `Year`(`gameYear`, `era`);

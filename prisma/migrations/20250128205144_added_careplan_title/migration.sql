/*
  Warnings:

  - Added the required column `title` to the `CarePlan` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CarePlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "clientId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CarePlan_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_CarePlan" ("clientId", "createdAt", "description", "endDate", "id", "startDate", "status", "updatedAt") SELECT "clientId", "createdAt", "description", "endDate", "id", "startDate", "status", "updatedAt" FROM "CarePlan";
DROP TABLE "CarePlan";
ALTER TABLE "new_CarePlan" RENAME TO "CarePlan";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

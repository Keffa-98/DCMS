/*
  Warnings:

  - You are about to drop the `CareGiver` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `careGiverId` on the `Client` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "CareGiver_userId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CareGiver";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "SupportWorker" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "last_name" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "date_of_birth" DATETIME NOT NULL,
    "addressId" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SupportWorker_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "SupportWorker_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Client" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "last_name" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "date_of_birth" DATETIME NOT NULL,
    "gender" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "supportWorkerId" TEXT,
    "emergencyContactId" TEXT NOT NULL,
    "addressId" TEXT,
    CONSTRAINT "Client_supportWorkerId_fkey" FOREIGN KEY ("supportWorkerId") REFERENCES "SupportWorker" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Client_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Client_emergencyContactId_fkey" FOREIGN KEY ("emergencyContactId") REFERENCES "EmergencyContact" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Client" ("addressId", "createdAt", "date_of_birth", "emergencyContactId", "first_name", "gender", "id", "last_name", "updatedAt") SELECT "addressId", "createdAt", "date_of_birth", "emergencyContactId", "first_name", "gender", "id", "last_name", "updatedAt" FROM "Client";
DROP TABLE "Client";
ALTER TABLE "new_Client" RENAME TO "Client";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "SupportWorker_userId_key" ON "SupportWorker"("userId");

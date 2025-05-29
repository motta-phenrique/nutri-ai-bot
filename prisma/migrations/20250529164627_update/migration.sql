/*
  Warnings:

  - You are about to drop the column `planoAtivo` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `planoExpiraEm` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "supabaseId" TEXT NOT NULL PRIMARY KEY,
    "telegramChatId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("createdAt", "supabaseId", "telegramChatId") SELECT "createdAt", "supabaseId", "telegramChatId" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_telegramChatId_key" ON "User"("telegramChatId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

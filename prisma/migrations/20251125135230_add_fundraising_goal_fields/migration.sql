-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BettingPool" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "creatorId" TEXT NOT NULL,
    "babyName" TEXT,
    "expectedDueDate" DATETIME NOT NULL,
    "betAmount" DECIMAL NOT NULL,
    "goalTitle" TEXT NOT NULL DEFAULT 'Prezent dla dziecka',
    "goalDescription" TEXT,
    "goalCost" DECIMAL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "actualBirthDate" DATETIME,
    "slug" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BettingPool_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_BettingPool" ("actualBirthDate", "babyName", "betAmount", "createdAt", "creatorId", "expectedDueDate", "id", "slug", "status", "updatedAt") SELECT "actualBirthDate", "babyName", "betAmount", "createdAt", "creatorId", "expectedDueDate", "id", "slug", "status", "updatedAt" FROM "BettingPool";
DROP TABLE "BettingPool";
ALTER TABLE "new_BettingPool" RENAME TO "BettingPool";
CREATE UNIQUE INDEX "BettingPool_slug_key" ON "BettingPool"("slug");
CREATE INDEX "BettingPool_slug_idx" ON "BettingPool"("slug");
CREATE INDEX "BettingPool_creatorId_idx" ON "BettingPool"("creatorId");
CREATE INDEX "BettingPool_status_idx" ON "BettingPool"("status");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

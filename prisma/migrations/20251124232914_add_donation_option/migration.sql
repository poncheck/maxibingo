-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Bet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "poolId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "predictedDate" DATETIME NOT NULL,
    "paymentId" TEXT,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "isDonation" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Bet_poolId_fkey" FOREIGN KEY ("poolId") REFERENCES "BettingPool" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Bet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Bet_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Bet" ("createdAt", "id", "isPaid", "paymentId", "poolId", "predictedDate", "userId") SELECT "createdAt", "id", "isPaid", "paymentId", "poolId", "predictedDate", "userId" FROM "Bet";
DROP TABLE "Bet";
ALTER TABLE "new_Bet" RENAME TO "Bet";
CREATE UNIQUE INDEX "Bet_paymentId_key" ON "Bet"("paymentId");
CREATE INDEX "Bet_poolId_idx" ON "Bet"("poolId");
CREATE INDEX "Bet_userId_idx" ON "Bet"("userId");
CREATE INDEX "Bet_predictedDate_idx" ON "Bet"("predictedDate");
CREATE UNIQUE INDEX "Bet_poolId_userId_key" ON "Bet"("poolId", "userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Activity" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "address" TEXT,
    "labels" TEXT,
    "picture" TEXT,
    "rating" INTEGER NOT NULL,
    "date" TEXT NOT NULL DEFAULT '2024-09-17',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Activity" ("address", "createdAt", "description", "id", "labels", "picture", "rating", "title") SELECT "address", "createdAt", "description", "id", "labels", "picture", "rating", "title" FROM "Activity";
DROP TABLE "Activity";
ALTER TABLE "new_Activity" RENAME TO "Activity";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

/*
  Warnings:

  - You are about to drop the column `behaviorId` on the `BehaviorLog` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "BehaviorLog" DROP CONSTRAINT "BehaviorLog_behaviorId_fkey";

-- AlterTable
ALTER TABLE "BehaviorLog" DROP COLUMN "behaviorId";

-- CreateTable
CREATE TABLE "BehaviorLogBehavior" (
    "behaviorLogId" INTEGER NOT NULL,
    "behaviorTypeId" INTEGER NOT NULL,

    CONSTRAINT "BehaviorLogBehavior_pkey" PRIMARY KEY ("behaviorLogId","behaviorTypeId")
);

-- AddForeignKey
ALTER TABLE "BehaviorLogBehavior" ADD CONSTRAINT "BehaviorLogBehavior_behaviorLogId_fkey" FOREIGN KEY ("behaviorLogId") REFERENCES "BehaviorLog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BehaviorLogBehavior" ADD CONSTRAINT "BehaviorLogBehavior_behaviorTypeId_fkey" FOREIGN KEY ("behaviorTypeId") REFERENCES "BehaviorType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

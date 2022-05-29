/*
  Warnings:

  - A unique constraint covering the columns `[stageId]` on the table `vtex_authentications` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "vtex_authentications" ADD COLUMN     "stageId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "vtex_authentications_stageId_key" ON "vtex_authentications"("stageId");

-- AddForeignKey
ALTER TABLE "vtex_authentications" ADD CONSTRAINT "vtex_authentications_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "stages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

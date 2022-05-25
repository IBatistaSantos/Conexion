-- AlterTable
ALTER TABLE "deals" ADD COLUMN     "person_id" TEXT;

-- AddForeignKey
ALTER TABLE "deals" ADD CONSTRAINT "deals_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

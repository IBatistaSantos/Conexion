-- DropIndex
DROP INDEX "products_code_key";

-- AlterTable
ALTER TABLE "deals" ADD COLUMN     "product_id" TEXT;

-- AddForeignKey
ALTER TABLE "deals" ADD CONSTRAINT "deals_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

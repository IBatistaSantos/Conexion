-- CreateTable
CREATE TABLE "vtex_authentications" (
    "id" TEXT NOT NULL,
    "appKey" TEXT NOT NULL,
    "appToken" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "integration_order" BOOLEAN NOT NULL,
    "integration_product" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vtex_authentications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "vtex_authentications_companyId_key" ON "vtex_authentications"("companyId");

-- AddForeignKey
ALTER TABLE "vtex_authentications" ADD CONSTRAINT "vtex_authentications_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

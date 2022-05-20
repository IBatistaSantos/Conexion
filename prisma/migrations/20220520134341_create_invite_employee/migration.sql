-- CreateEnum
CREATE TYPE "StatusInvite" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "invite_employees" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "status" "StatusInvite" NOT NULL DEFAULT E'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invite_employees_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "invite_employees_email_key" ON "invite_employees"("email");

-- CreateIndex
CREATE UNIQUE INDEX "invite_employees_code_key" ON "invite_employees"("code");

-- CreateIndex
CREATE UNIQUE INDEX "invite_employees_companyId_key" ON "invite_employees"("companyId");

-- AddForeignKey
ALTER TABLE "invite_employees" ADD CONSTRAINT "invite_employees_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

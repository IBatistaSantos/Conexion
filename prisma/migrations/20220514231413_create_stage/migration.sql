-- CreateTable
CREATE TABLE "stages" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "pipelineId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "stages" ADD CONSTRAINT "stages_pipelineId_fkey" FOREIGN KEY ("pipelineId") REFERENCES "pipelines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

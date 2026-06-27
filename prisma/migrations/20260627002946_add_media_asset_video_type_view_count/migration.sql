-- CreateEnum
CREATE TYPE "VideoType" AS ENUM ('SHORT', 'LONG');

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "viewsCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "PostMedia" ADD COLUMN     "mediaAssetId" TEXT,
ADD COLUMN     "videoType" "VideoType";

-- AlterTable
ALTER TABLE "Story" ADD COLUMN     "mediaAssetId" TEXT;

-- CreateTable
CREATE TABLE "MediaAsset" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "bucket" TEXT,
    "key" TEXT,
    "url" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER,
    "width" INTEGER,
    "height" INTEGER,
    "durationSeconds" INTEGER,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MediaAsset_ownerId_idx" ON "MediaAsset"("ownerId");

-- CreateIndex
CREATE INDEX "MediaAsset_createdAt_idx" ON "MediaAsset"("createdAt");

-- CreateIndex
CREATE INDEX "PostMedia_mediaAssetId_idx" ON "PostMedia"("mediaAssetId");

-- CreateIndex
CREATE INDEX "Story_mediaAssetId_idx" ON "Story"("mediaAssetId");

-- AddForeignKey
ALTER TABLE "PostMedia" ADD CONSTRAINT "PostMedia_mediaAssetId_fkey" FOREIGN KEY ("mediaAssetId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Story" ADD CONSTRAINT "Story_mediaAssetId_fkey" FOREIGN KEY ("mediaAssetId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaAsset" ADD CONSTRAINT "MediaAsset_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;


/*
  Warnings:

  - Added the required column `bodyJson` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."ImageType" AS ENUM ('COVER', 'CONTENT');

-- AlterTable
ALTER TABLE "public"."Comment" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Post" ADD COLUMN     "bodyJson" JSONB NOT NULL,
ADD COLUMN     "coverImagePath" VARCHAR(500);

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "avatarPath" VARCHAR(500);

-- CreateIndex
CREATE INDEX "User_email_idx" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "public"."User"("username");

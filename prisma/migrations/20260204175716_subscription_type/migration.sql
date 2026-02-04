/*
  Warnings:

  - Changed the type of `type` on the `Subscription` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."SubscriptionType" AS ENUM ('STANDARD', 'PRO');

-- AlterTable
ALTER TABLE "public"."Subscription" DROP COLUMN "type",
ADD COLUMN     "type" "public"."SubscriptionType" NOT NULL;

-- DropEnum
DROP TYPE "public"."SubcriptionType";

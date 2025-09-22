-- CreateTable
CREATE TABLE "public"."VkUser" (
    "id" INTEGER NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "VkUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VkUser_userId_key" ON "public"."VkUser"("userId");

-- AddForeignKey
ALTER TABLE "public"."VkUser" ADD CONSTRAINT "VkUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

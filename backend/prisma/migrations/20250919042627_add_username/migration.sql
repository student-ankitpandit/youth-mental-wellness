/*
  Warnings:

  - You are about to drop the `chat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `dashboard` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `journaling` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."chat" DROP CONSTRAINT "chat_chatSessionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."journaling" DROP CONSTRAINT "journaling_dashboardId_fkey";

-- DropForeignKey
ALTER TABLE "public"."message" DROP CONSTRAINT "message_chats_fkey";

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "username" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."chat";

-- DropTable
DROP TABLE "public"."dashboard";

-- DropTable
DROP TABLE "public"."journaling";

-- CreateTable
CREATE TABLE "public"."Dashboard" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dashboard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Journaling" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "dashboardId" TEXT NOT NULL,

    CONSTRAINT "Journaling_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Chat" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chatSessionId" TEXT NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Journaling" ADD CONSTRAINT "Journaling_dashboardId_fkey" FOREIGN KEY ("dashboardId") REFERENCES "public"."Dashboard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Chat" ADD CONSTRAINT "Chat_chatSessionId_fkey" FOREIGN KEY ("chatSessionId") REFERENCES "public"."chatSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."message" ADD CONSTRAINT "message_chats_fkey" FOREIGN KEY ("chats") REFERENCES "public"."Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

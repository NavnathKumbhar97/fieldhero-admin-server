/*
  Warnings:

  - You are about to drop the column `email` on the `EmailLog` table. All the data in the column will be lost.
  - You are about to drop the column `fullName` on the `EmailLog` table. All the data in the column will be lost.
  - You are about to drop the column `reason` on the `EmailLog` table. All the data in the column will be lost.
  - Added the required column `emailTo` to the `EmailLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `templateId` to the `EmailLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `EmailLog` DROP COLUMN `email`,
    DROP COLUMN `fullName`,
    DROP COLUMN `reason`,
    ADD COLUMN `emailTo` VARCHAR(80) NOT NULL,
    ADD COLUMN `templateId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `EmailTemplate` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `templateId` VARCHAR(10) NOT NULL,
    `template` TEXT NOT NULL,
    `note` VARCHAR(500),
    `createdOn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedOn` DATETIME(3) NOT NULL,
    `createdBy` INTEGER,
    `modifiedBy` INTEGER,

    UNIQUE INDEX `EmailTemplate.templateId_unique`(`templateId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `EmailTemplate` ADD FOREIGN KEY (`createdBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmailTemplate` ADD FOREIGN KEY (`modifiedBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmailLog` ADD FOREIGN KEY (`templateId`) REFERENCES `EmailTemplate`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to alter the column `fullName` on the `Candidate` table. The data in that column could be lost. The data in that column will be cast from `VarChar(200)` to `VarChar(100)`.
  - You are about to alter the column `permZip` on the `Candidate` table. The data in that column could be lost. The data in that column will be cast from `VarChar(10)` to `VarChar(6)`.
  - You are about to alter the column `currZip` on the `Candidate` table. The data in that column could be lost. The data in that column will be cast from `VarChar(10)` to `VarChar(6)`.
  - You are about to alter the column `aadharNo` on the `Candidate` table. The data in that column could be lost. The data in that column will be cast from `VarChar(15)` to `VarChar(12)`.
  - You are about to drop the column `companyId` on the `CandidateWorkHistory` table. All the data in the column will be lost.
  - You are about to drop the column `designation` on the `CandidateWorkHistory` table. All the data in the column will be lost.
  - You are about to drop the column `industryId` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `candidateWorkHistoryId` on the `SkillOnCandidateWorkHistory` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[candidateRawid]` on the table `Candidate` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title]` on the table `Category` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `CandidateWorkHistory` DROP FOREIGN KEY `CandidateWorkHistory_ibfk_2`;

-- DropForeignKey
ALTER TABLE `Category` DROP FOREIGN KEY `Category_ibfk_1`;

-- DropForeignKey
ALTER TABLE `SkillOnCandidateWorkHistory` DROP FOREIGN KEY `SkillOnCandidateWorkHistory_ibfk_1`;

-- DropIndex
DROP INDEX `Category.industryId_title_unique` ON `Category`;

-- AlterTable
ALTER TABLE `Candidate` ADD COLUMN `candidateRawid` INTEGER,
    ADD COLUMN `education` VARCHAR(40),
    ADD COLUMN `expYears` INTEGER,
    ADD COLUMN `preferLocation1` VARCHAR(80),
    ADD COLUMN `preferLocation2` VARCHAR(80),
    ADD COLUMN `primaryLanguage` ENUM('ASSAMESE', 'BENGALI', 'BHOJPURI', 'ENGLISH', 'GUJARATI', 'HINDI', 'KANNADA', 'MAITHILI', 'MALAYALAM', 'MARATHI', 'ODIA', 'PUNJABI', 'SANSKRIT', 'SANTALI', 'TAMIL', 'TELUGU', 'URDU'),
    ADD COLUMN `secondaryLanguage` ENUM('ASSAMESE', 'BENGALI', 'BHOJPURI', 'ENGLISH', 'GUJARATI', 'HINDI', 'KANNADA', 'MAITHILI', 'MALAYALAM', 'MARATHI', 'ODIA', 'PUNJABI', 'SANSKRIT', 'SANTALI', 'TAMIL', 'TELUGU', 'URDU'),
    ADD COLUMN `skill1` VARCHAR(45),
    ADD COLUMN `skill2` VARCHAR(45),
    ADD COLUMN `status` ENUM('SYSTEM_VERIFIED', 'VERIFICATION_IN_PROGRESS', 'OTHER_UPDATE_PENDING', 'APPROVAL_PENDING', 'APPROVED', 'REJECTED', 'INACTIVE') NOT NULL DEFAULT 'INACTIVE',
    ADD COLUMN `thirdLanguage` VARCHAR(30),
    MODIFY `fullName` VARCHAR(100) NOT NULL,
    MODIFY `permZip` VARCHAR(6),
    MODIFY `currZip` VARCHAR(6),
    MODIFY `aadharNo` VARCHAR(12),
    MODIFY `approvedOn` DATETIME(3);

-- AlterTable
ALTER TABLE `CandidateCallCentreHistory` ADD COLUMN `candidateId` INTEGER,
    ADD COLUMN `education` BOOLEAN,
    MODIFY `candidateVersioningId` INTEGER;

-- AlterTable
ALTER TABLE `CandidateRaw` ADD COLUMN `education` TEXT;

-- AlterTable
ALTER TABLE `CandidateUploadBatch` ADD COLUMN `agentPricingTemplate` INTEGER,
    ADD COLUMN `uploadedBy` INTEGER,
    MODIFY `status` ENUM('PENDING_PROCESSING', 'IN_PROGRESS', 'ADMIN_APPROVAL_PENDING', 'PROCESSED') NOT NULL DEFAULT 'PENDING_PROCESSING';

-- AlterTable
ALTER TABLE `CandidateVersioning` ADD COLUMN `currCategory` VARCHAR(80),
    ADD COLUMN `currIndustry` VARCHAR(80),
    ADD COLUMN `education` VARCHAR(50),
    ADD COLUMN `newCategory` VARCHAR(80),
    ADD COLUMN `newIndustry` VARCHAR(80);

-- AlterTable
ALTER TABLE `CandidateWorkHistory` DROP COLUMN `companyId`,
    DROP COLUMN `designation`,
    ADD COLUMN `categoryId` INTEGER,
    ADD COLUMN `categoryTitle` VARCHAR(80),
    ADD COLUMN `company` VARCHAR(100),
    ADD COLUMN `industryId` INTEGER,
    ADD COLUMN `industryTitle` VARCHAR(80),
    ADD COLUMN `isEmployed` BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE `Category` DROP COLUMN `industryId`;

-- AlterTable
ALTER TABLE `Permission` MODIFY `name` VARCHAR(80) NOT NULL,
    MODIFY `group` VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE `SkillOnCandidateWorkHistory` DROP COLUMN `candidateWorkHistoryId`;

-- CreateTable
CREATE TABLE `CandidateIndustry` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `candidateId` INTEGER NOT NULL,
    `industryId` INTEGER NOT NULL,
    `title` VARCHAR(80),
    `createdOn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedOn` DATETIME(3) NOT NULL,
    `createdBy` INTEGER,
    `modifiedBy` INTEGER,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CandidateCategory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `candidateId` INTEGER NOT NULL,
    `categoryId` INTEGER NOT NULL,
    `title` VARCHAR(80),
    `createdOn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedOn` DATETIME(3) NOT NULL,
    `createdBy` INTEGER,
    `modifiedBy` INTEGER,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AgentPricingTemplate` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `templateName` VARCHAR(30) NOT NULL,
    `description` VARCHAR(100),
    `approvalRemarks` VARCHAR(200),
    `isActive` BOOLEAN NOT NULL DEFAULT false,
    `industry` DOUBLE NOT NULL DEFAULT 0,
    `category` DOUBLE NOT NULL DEFAULT 0,
    `fullName` DOUBLE NOT NULL DEFAULT 0,
    `dob` DOUBLE NOT NULL DEFAULT 0,
    `gender` DOUBLE NOT NULL DEFAULT 0,
    `permAddress` DOUBLE NOT NULL DEFAULT 0,
    `permCity` DOUBLE NOT NULL DEFAULT 0,
    `permState` DOUBLE NOT NULL DEFAULT 0,
    `permZip` DOUBLE NOT NULL DEFAULT 0,
    `currAddress` DOUBLE NOT NULL DEFAULT 0,
    `currCity` DOUBLE NOT NULL DEFAULT 0,
    `currState` DOUBLE NOT NULL DEFAULT 0,
    `currZip` DOUBLE NOT NULL DEFAULT 0,
    `email1` DOUBLE NOT NULL DEFAULT 0,
    `contactNo1` DOUBLE NOT NULL DEFAULT 0,
    `contactNo2` DOUBLE NOT NULL DEFAULT 0,
    `aadharNo` DOUBLE NOT NULL DEFAULT 0,
    `panNo` DOUBLE NOT NULL DEFAULT 0,
    `dlNo` DOUBLE NOT NULL DEFAULT 0,
    `expYears` DOUBLE NOT NULL DEFAULT 0,
    `expMonths` DOUBLE NOT NULL DEFAULT 0,
    `preferLocation1` DOUBLE NOT NULL DEFAULT 0,
    `preferLocation2` DOUBLE NOT NULL DEFAULT 0,
    `skill1` DOUBLE NOT NULL DEFAULT 0,
    `skill2` DOUBLE NOT NULL DEFAULT 0,
    `primaryLanguage` DOUBLE NOT NULL DEFAULT 0,
    `secondaryLanguage` DOUBLE NOT NULL DEFAULT 0,
    `lastCompany` DOUBLE NOT NULL DEFAULT 0,
    `designation` DOUBLE NOT NULL DEFAULT 0,
    `startDate` DOUBLE NOT NULL DEFAULT 0,
    `endDate` DOUBLE NOT NULL DEFAULT 0,
    `jobDescription` DOUBLE NOT NULL DEFAULT 0,
    `totalAmount` DOUBLE NOT NULL,
    `createdOn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedOn` DATETIME(3) NOT NULL,
    `createdBy` INTEGER,
    `modifiedBy` INTEGER,

    UNIQUE INDEX `AgentPricingTemplate.templateName_unique`(`templateName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SMSLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `contactNo` VARCHAR(10) NOT NULL,
    `fullName` VARCHAR(100),
    `reason` ENUM('CANDIDATE_REGISTERED') NOT NULL,
    `createdOn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedOn` DATETIME(3) NOT NULL,
    `createdBy` INTEGER,
    `modifiedBy` INTEGER,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EmailLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(80) NOT NULL,
    `fullName` VARCHAR(100),
    `reason` ENUM('ADMIN_REGISTERED', 'AGENT_REGISTERED', 'BATCH_PROCESSED', 'FORGOT_PASSWORD_REQUESTED', 'FORGOT_PASSWORD_PROCESSED', 'RESET_PASSWORD_PROCESSED') NOT NULL,
    `createdOn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedOn` DATETIME(3) NOT NULL,
    `createdBy` INTEGER,
    `modifiedBy` INTEGER,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CandidateVerification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `candidateId` INTEGER NOT NULL,
    `industry` BOOLEAN,
    `category` BOOLEAN,
    `fullName` BOOLEAN,
    `dob` BOOLEAN,
    `currCity` BOOLEAN,
    `currZip` BOOLEAN,
    `email1` BOOLEAN,
    `contactNo1` BOOLEAN,
    `expYears` BOOLEAN,
    `preferLocation1` BOOLEAN,
    `preferLocation2` BOOLEAN,
    `skill1` BOOLEAN,
    `skill2` BOOLEAN,
    `primaryLanguage` BOOLEAN,
    `secondaryLanguage` BOOLEAN,
    `education` BOOLEAN,
    `lastCompany` BOOLEAN,
    `designation` BOOLEAN,
    `createdOn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedOn` DATETIME(3) NOT NULL,
    `createdBy` INTEGER,
    `modifiedBy` INTEGER,

    UNIQUE INDEX `CandidateVerification_candidateId_unique`(`candidateId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BatchPriority` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `batchId` INTEGER NOT NULL,
    `assignedTo` INTEGER NOT NULL,
    `createdOn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedOn` DATETIME(3) NOT NULL,
    `createdBy` INTEGER,
    `modifiedBy` INTEGER,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Candidate_candidateRawid_unique` ON `Candidate`(`candidateRawid`);

-- CreateIndex
CREATE UNIQUE INDEX `Category.title_unique` ON `Category`(`title`);

-- AddForeignKey
ALTER TABLE `CandidateUploadBatch` ADD FOREIGN KEY (`uploadedBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidateUploadBatch` ADD FOREIGN KEY (`agentPricingTemplate`) REFERENCES `AgentPricingTemplate`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidateCallCentreHistory` ADD FOREIGN KEY (`candidateId`) REFERENCES `Candidate`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Candidate` ADD FOREIGN KEY (`candidateRawid`) REFERENCES `CandidateRaw`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidateIndustry` ADD FOREIGN KEY (`candidateId`) REFERENCES `Candidate`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidateIndustry` ADD FOREIGN KEY (`industryId`) REFERENCES `Industry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidateIndustry` ADD FOREIGN KEY (`createdBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidateIndustry` ADD FOREIGN KEY (`modifiedBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidateCategory` ADD FOREIGN KEY (`candidateId`) REFERENCES `Candidate`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidateCategory` ADD FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidateCategory` ADD FOREIGN KEY (`createdBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidateCategory` ADD FOREIGN KEY (`modifiedBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidateWorkHistory` ADD FOREIGN KEY (`industryId`) REFERENCES `Industry`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidateWorkHistory` ADD FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AgentPricingTemplate` ADD FOREIGN KEY (`createdBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AgentPricingTemplate` ADD FOREIGN KEY (`modifiedBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SMSLog` ADD FOREIGN KEY (`createdBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SMSLog` ADD FOREIGN KEY (`modifiedBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmailLog` ADD FOREIGN KEY (`createdBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmailLog` ADD FOREIGN KEY (`modifiedBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidateVerification` ADD FOREIGN KEY (`candidateId`) REFERENCES `Candidate`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidateVerification` ADD FOREIGN KEY (`createdBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidateVerification` ADD FOREIGN KEY (`modifiedBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BatchPriority` ADD FOREIGN KEY (`batchId`) REFERENCES `CandidateUploadBatch`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BatchPriority` ADD FOREIGN KEY (`assignedTo`) REFERENCES `UserLogin`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BatchPriority` ADD FOREIGN KEY (`createdBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BatchPriority` ADD FOREIGN KEY (`modifiedBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

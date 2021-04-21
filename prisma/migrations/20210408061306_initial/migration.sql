-- CreateTable
CREATE TABLE `Permission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(40) NOT NULL,
    `description` VARCHAR(200),
    `displayName` VARCHAR(40) NOT NULL,
    `group` VARCHAR(30) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdOn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedOn` DATETIME(3) NOT NULL,
UNIQUE INDEX `Permission.name_unique`(`name`),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(40) NOT NULL,
    `description` VARCHAR(200),
    `isSystemGenerated` BOOLEAN NOT NULL DEFAULT false,
    `uuid` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdOn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedOn` DATETIME(3) NOT NULL,
    `createdBy` INTEGER,
    `modifiedBy` INTEGER,
UNIQUE INDEX `Role.name_unique`(`name`),
UNIQUE INDEX `Role.uuid_unique`(`uuid`),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fullName` VARCHAR(200) NOT NULL,
    `dob` DATE,
    `gender` ENUM('MALE', 'FEMALE', 'OTHER'),
    `permAddress` VARCHAR(500),
    `permCity` VARCHAR(45),
    `permState` VARCHAR(45),
    `permCountry` VARCHAR(45),
    `permZip` VARCHAR(10),
    `currAddress` VARCHAR(500),
    `currCity` VARCHAR(45),
    `currState` VARCHAR(45),
    `currCountry` VARCHAR(45),
    `currZip` VARCHAR(10),
    `panCard` VARCHAR(20),
    `aadharCard` VARCHAR(15),
    `primaryLang` VARCHAR(30),
    `secondaryLang` VARCHAR(30),
    `thirdLang` VARCHAR(30),
    `profileImage` VARCHAR(500),
    `note` VARCHAR(500),
    `uuid` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdOn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedOn` DATETIME(3) NOT NULL,
    `createdBy` INTEGER,
    `modifiedBy` INTEGER,
UNIQUE INDEX `User.panCard_unique`(`panCard`),
UNIQUE INDEX `User.aadharCard_unique`(`aadharCard`),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserLogin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `roleId` INTEGER NOT NULL,
    `email` VARCHAR(80) NOT NULL,
    `contactNo` VARCHAR(20),
    `passwordHash` VARCHAR(200) NOT NULL,
    `isSystemGenerated` BOOLEAN NOT NULL DEFAULT false,
    `resetToken` VARCHAR(500),
    `resetExpires` DATETIME(3),
    `createdOn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedOn` DATETIME(3) NOT NULL,
    `createdBy` INTEGER,
    `modifiedBy` INTEGER,
UNIQUE INDEX `UserLogin.userId_unique`(`userId`),
UNIQUE INDEX `UserLogin.email_unique`(`email`),
UNIQUE INDEX `UserLogin.contactNo_unique`(`contactNo`),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RolePermission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `roleId` INTEGER NOT NULL,
    `permissionId` INTEGER NOT NULL,
    `createdOn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedOn` DATETIME(3) NOT NULL,
    `createdBy` INTEGER,
    `modifiedBy` INTEGER,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Industry` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(80) NOT NULL,
    `description` VARCHAR(100),
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdOn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedOn` DATETIME(3) NOT NULL,
    `createdBy` INTEGER,
    `modifiedBy` INTEGER,
UNIQUE INDEX `Industry.title_unique`(`title`),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Skill` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(45) NOT NULL,
    `description` VARCHAR(100),
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdOn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedOn` DATETIME(3) NOT NULL,
    `createdBy` INTEGER,
    `modifiedBy` INTEGER,
UNIQUE INDEX `Skill.title_unique`(`title`),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Subscription` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `planName` VARCHAR(40) NOT NULL,
    `dataCount` INTEGER NOT NULL DEFAULT 0,
    `durationMonths` INTEGER NOT NULL DEFAULT 0,
    `price` DOUBLE NOT NULL DEFAULT 0,
    `note` VARCHAR(200),
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdOn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedOn` DATETIME(3) NOT NULL,
    `createdBy` INTEGER,
    `modifiedBy` INTEGER,
UNIQUE INDEX `Subscription.planName_unique`(`planName`),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CandidateUploadBatch` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `timestamp` DATETIME(3) NOT NULL,
    `count` INTEGER NOT NULL,
    `status` ENUM('PENDING_PROCESSING', 'IN_PROGRESS', 'PROCESSED') NOT NULL DEFAULT 'PENDING_PROCESSING',
    `approvedCount` INTEGER,
    `rejectedCount` INTEGER,
    `paymentAmount` DOUBLE,
    `paymentStatus` ENUM('PENDING', 'PAID'),
    `paymentDate` DATE,
    `paymentRemarks` VARCHAR(200),
    `createdOn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedOn` DATETIME(3) NOT NULL,
    `createdBy` INTEGER,
    `modifiedBy` INTEGER,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CandidateRaw` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `industry` TEXT,
    `category` TEXT,
    `fullName` TEXT,
    `dob` TEXT,
    `gender` TEXT,
    `permAddress` TEXT,
    `permCity` TEXT,
    `permState` TEXT,
    `permCountry` TEXT,
    `permZip` TEXT,
    `currAddress` TEXT,
    `currCity` TEXT,
    `currState` TEXT,
    `currCountry` TEXT,
    `currZip` TEXT,
    `email1` TEXT,
    `email2` TEXT,
    `contactNo1` TEXT,
    `contactNo2` TEXT,
    `aadharNo` TEXT,
    `panNo` TEXT,
    `dlNo` TEXT,
    `expYears` TEXT,
    `expMonths` TEXT,
    `prefLocation1` TEXT,
    `prefLocation2` TEXT,
    `prefLocation3` TEXT,
    `skill1` TEXT,
    `skill2` TEXT,
    `primaryLang` TEXT,
    `secondaryLang` TEXT,
    `thirdLang` TEXT,
    `lastCompany` TEXT,
    `designation` TEXT,
    `startDate` TEXT,
    `endDate` TEXT,
    `jobDescription` TEXT,
    `rowNum` INTEGER NOT NULL,
    `batchId` INTEGER NOT NULL,
    `isSystemApproved` BOOLEAN NOT NULL,
    `createdOn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedOn` DATETIME(3) NOT NULL,
    `createdBy` INTEGER,
    `modifiedBy` INTEGER,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CandidateRejectionSummary` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `columnName` VARCHAR(40) NOT NULL,
    `rejectionType` ENUM('REJECT', 'IGNORE') NOT NULL,
    `rejectionReason` ENUM('MANDATORY', 'DUPLICATE', 'WRONG_INPUT', 'LENGTH_EXCEEDED', 'CONSENT_DECLINED') NOT NULL,
    `rejectedBy` ENUM('SYSTEM', 'USER') NOT NULL,
    `rejectById` INTEGER,
    `candidateRawId` INTEGER NOT NULL,
    `createdOn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedOn` DATETIME(3) NOT NULL,
    `createdBy` INTEGER,
    `modifiedBy` INTEGER,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CandidateVersioning` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `industry` VARCHAR(80),
    `category` VARCHAR(80) NOT NULL,
    `fullName` VARCHAR(200) NOT NULL,
    `dob` DATE,
    `gender` ENUM('MALE', 'FEMALE', 'OTHER'),
    `permAddress` VARCHAR(500),
    `permCity` VARCHAR(45),
    `permState` VARCHAR(45),
    `permCountry` VARCHAR(45),
    `permZip` VARCHAR(10),
    `currAddress` VARCHAR(500),
    `currCity` VARCHAR(45) NOT NULL,
    `currState` VARCHAR(45),
    `currCountry` VARCHAR(45),
    `currZip` VARCHAR(10),
    `email1` VARCHAR(80),
    `email2` VARCHAR(80),
    `contactNo1` VARCHAR(45) NOT NULL,
    `contactNo2` VARCHAR(45),
    `aadharNo` VARCHAR(15),
    `panNo` VARCHAR(12),
    `dlNo` VARCHAR(20),
    `registrationStatus` VARCHAR(15),
    `expYears` INTEGER,
    `expMonths` INTEGER,
    `preferLocation1` VARCHAR(80),
    `preferLocation2` VARCHAR(80),
    `preferLocation3` VARCHAR(80),
    `skill1` VARCHAR(45),
    `skill2` VARCHAR(45),
    `primaryLanguage` VARCHAR(30),
    `secondaryLanguage` VARCHAR(30),
    `thirdLanguage` VARCHAR(30),
    `lastCompany` VARCHAR(100),
    `designation` VARCHAR(80),
    `startDate` DATE,
    `endDate` DATE,
    `jobDescription` VARCHAR(200),
    `candidateRawId` INTEGER NOT NULL,
    `version` INTEGER NOT NULL,
    `createdOn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedOn` DATETIME(3) NOT NULL,
    `createdBy` INTEGER,
    `modifiedBy` INTEGER,
UNIQUE INDEX `CandidateVersioning.email1_unique`(`email1`),
UNIQUE INDEX `CandidateVersioning.contactNo1_unique`(`contactNo1`),
UNIQUE INDEX `CandidateVersioning.aadharNo_unique`(`aadharNo`),
UNIQUE INDEX `CandidateVersioning.panNo_unique`(`panNo`),
UNIQUE INDEX `CandidateVersioning.dlNo_unique`(`dlNo`),
UNIQUE INDEX `CandidateVersioning.registrationStatus_unique`(`registrationStatus`),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CandidateCallCentreHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `candidateVersioningId` INTEGER NOT NULL,
    `callStatus` VARCHAR(40) NOT NULL,
    `comment` VARCHAR(500),
    `candidateConsent` ENUM('PENDING', 'DECLINED', 'RECEIVED') NOT NULL DEFAULT 'PENDING',
    `consentReason` VARCHAR(100),
    `isSubmitted` BOOLEAN NOT NULL DEFAULT false,
    `createdOn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedOn` DATETIME(3) NOT NULL,
    `createdBy` INTEGER,
    `modifiedBy` INTEGER,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Candidate` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fullName` VARCHAR(200) NOT NULL,
    `dob` DATE,
    `gender` ENUM('MALE', 'FEMALE', 'OTHER'),
    `permAddress` VARCHAR(500),
    `permCity` VARCHAR(45),
    `permState` VARCHAR(45),
    `permCountry` VARCHAR(45),
    `permZip` VARCHAR(10),
    `currAddress` VARCHAR(500),
    `currCity` VARCHAR(45) NOT NULL,
    `currState` VARCHAR(45),
    `currCountry` VARCHAR(45),
    `currZip` VARCHAR(10),
    `email1` VARCHAR(80),
    `email2` VARCHAR(80),
    `contactNo1` VARCHAR(45) NOT NULL,
    `contactNo2` VARCHAR(45),
    `aadharNo` VARCHAR(15),
    `panNo` VARCHAR(12),
    `dlNo` VARCHAR(20),
    `note` VARCHAR(500),
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdOn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedOn` DATETIME(3) NOT NULL,
    `approvedOn` DATETIME(3) NOT NULL,
    `createdBy` INTEGER,
    `modifiedBy` INTEGER,
    `approvedBy` INTEGER,
UNIQUE INDEX `Candidate.email1_unique`(`email1`),
UNIQUE INDEX `Candidate.contactNo1_unique`(`contactNo1`),
UNIQUE INDEX `Candidate.aadharNo_unique`(`aadharNo`),
UNIQUE INDEX `Candidate.panNo_unique`(`panNo`),
UNIQUE INDEX `Candidate.dlNo_unique`(`dlNo`),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CandidateOther` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `candidateId` INTEGER NOT NULL,
    `expMonths` INTEGER,
    `expYears` INTEGER,
    `registrationStatus` VARCHAR(15),
    `profileImage` VARCHAR(500),
    `createdOn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedOn` DATETIME(3) NOT NULL,
    `createdBy` INTEGER,
    `modifiedBy` INTEGER,
UNIQUE INDEX `CandidateOther_candidateId_unique`(`candidateId`),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CandidateTraining` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('TRAINING', 'CERTIFICATE', 'OTHER') NOT NULL DEFAULT 'OTHER',
    `title` VARCHAR(100) NOT NULL,
    `issueDate` DATE,
    `issuedBy` VARCHAR(80),
    `description` VARCHAR(200),
    `candidateId` INTEGER NOT NULL,
    `skillId` INTEGER,
    `createdOn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedOn` DATETIME(3) NOT NULL,
    `createdBy` INTEGER,
    `modifiedBy` INTEGER,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CandidateJobPreference` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `candidateId` INTEGER NOT NULL,
    `categoryId` INTEGER NOT NULL,
    `preferLocation1` VARCHAR(80),
    `preferLocation2` VARCHAR(80),
    `preferLocation3` VARCHAR(80),
    `skill1` INTEGER,
    `skill2` INTEGER,
    `lastCompany` VARCHAR(100),
    `designation` VARCHAR(80),
    `startDate` DATE,
    `endDate` DATE,
    `jobDescription` VARCHAR(200),
    `createdOn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedOn` DATETIME(3) NOT NULL,
    `createdBy` INTEGER,
    `modifiedBy` INTEGER,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `industryId` INTEGER NOT NULL,
    `title` VARCHAR(80) NOT NULL,
    `description` VARCHAR(100),
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdOn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedOn` DATETIME(3) NOT NULL,
    `createdBy` INTEGER,
    `modifiedBy` INTEGER,
UNIQUE INDEX `Category.industryId_title_unique`(`industryId`, `title`),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Agent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `agentNo` VARCHAR(15),
    `professionalStatus` VARCHAR(40),
    `gstin` VARCHAR(20),
    `companyName` VARCHAR(100),
    `bankName` VARCHAR(100),
    `bankAc` VARCHAR(30),
    `bankIfsc` VARCHAR(20),
    `bankAcType` VARCHAR(20),
    `workLocation1` VARCHAR(60),
    `workLocation2` VARCHAR(60),
    `panCardPath` VARCHAR(500),
    `docPoitype` VARCHAR(30),
    `docPoiValue` VARCHAR(30),
    `docPoiPath` VARCHAR(500),
    `docPoatype` VARCHAR(30),
    `docPoaValue` VARCHAR(30),
    `docPoaPath` VARCHAR(500),
    `docBanktype` VARCHAR(30),
    `docBankValue` VARCHAR(30),
    `docBankPath` VARCHAR(500),
    `status` ENUM('PENDING', 'REGISTERED'),
    `createdOn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedOn` DATETIME(3) NOT NULL,
    `createdBy` INTEGER,
    `modifiedBy` INTEGER,
UNIQUE INDEX `Agent.gstin_unique`(`gstin`),
UNIQUE INDEX `Agent_userId_unique`(`userId`),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Customer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fullName` VARCHAR(200) NOT NULL,
    `companyName` VARCHAR(100),
    `dob` DATE,
    `gender` ENUM('MALE', 'FEMALE', 'OTHER'),
    `state` VARCHAR(45),
    `country` VARCHAR(45),
    `profileImage` VARCHAR(500),
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdOn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedOn` DATETIME(3) NOT NULL,
    `createdBy` INTEGER,
    `modifiedBy` INTEGER,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CustomerLogin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customerId` INTEGER NOT NULL,
    `email` VARCHAR(80) NOT NULL,
    `passwordHash` VARCHAR(200) NOT NULL,
    `resetToken` VARCHAR(500),
    `resetExpires` DATETIME(3),
    `status` ENUM('PENDING', 'VERIFIED') NOT NULL DEFAULT 'PENDING',
    `newEmail` VARCHAR(80),
    `newEmailToken` VARCHAR(500),
    `createdOn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedOn` DATETIME(3) NOT NULL,
    `createdBy` INTEGER,
    `modifiedBy` INTEGER,
UNIQUE INDEX `CustomerLogin.email_unique`(`email`),
UNIQUE INDEX `CustomerLogin_customerId_unique`(`customerId`),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CustomerSubscription` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customerId` INTEGER NOT NULL,
    `startDate` DATE NOT NULL,
    `expiryDate` DATE NOT NULL,
    `planName` VARCHAR(40),
    `allocatedData` INTEGER NOT NULL,
    `usedData` INTEGER NOT NULL,
    `status` VARCHAR(20) NOT NULL,
    `comment` VARCHAR(200),
    `createdOn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedOn` DATETIME(3) NOT NULL,
    `createdBy` INTEGER,
    `modifiedBy` INTEGER,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CustomerToken` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customerId` INTEGER NOT NULL,
    `token` VARCHAR(500) NOT NULL,
    `createdOn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedOn` DATETIME(3) NOT NULL,
    `createdBy` INTEGER,
    `modifiedBy` INTEGER,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Company` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companyName` VARCHAR(100) NOT NULL,
    `description` VARCHAR(200),
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `industryId` INTEGER,
    `createdOn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedOn` DATETIME(3) NOT NULL,
    `createdBy` INTEGER,
    `modifiedBy` INTEGER,
UNIQUE INDEX `Company.companyName_unique`(`companyName`),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CandidateWorkHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `startDate` DATE,
    `endDate` DATE,
    `designation` VARCHAR(80),
    `description` VARCHAR(200),
    `candidateId` INTEGER NOT NULL,
    `companyId` INTEGER,
    `createdOn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedOn` DATETIME(3) NOT NULL,
    `createdBy` INTEGER,
    `modifiedBy` INTEGER,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SkillOnCandidateWorkHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `candidateWorkHistoryId` INTEGER NOT NULL,
    `skillId` INTEGER NOT NULL,
    `createdOn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedOn` DATETIME(3) NOT NULL,
    `createdBy` INTEGER,
    `modifiedBy` INTEGER,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Role` ADD FOREIGN KEY (`createdBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Role` ADD FOREIGN KEY (`modifiedBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD FOREIGN KEY (`createdBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD FOREIGN KEY (`modifiedBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserLogin` ADD FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserLogin` ADD FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserLogin` ADD FOREIGN KEY (`createdBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserLogin` ADD FOREIGN KEY (`modifiedBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RolePermission` ADD FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RolePermission` ADD FOREIGN KEY (`permissionId`) REFERENCES `Permission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RolePermission` ADD FOREIGN KEY (`createdBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RolePermission` ADD FOREIGN KEY (`modifiedBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Industry` ADD FOREIGN KEY (`createdBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Industry` ADD FOREIGN KEY (`modifiedBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Skill` ADD FOREIGN KEY (`createdBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Skill` ADD FOREIGN KEY (`modifiedBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subscription` ADD FOREIGN KEY (`createdBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subscription` ADD FOREIGN KEY (`modifiedBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidateUploadBatch` ADD FOREIGN KEY (`createdBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidateUploadBatch` ADD FOREIGN KEY (`modifiedBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidateRaw` ADD FOREIGN KEY (`batchId`) REFERENCES `CandidateUploadBatch`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidateRaw` ADD FOREIGN KEY (`createdBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidateRaw` ADD FOREIGN KEY (`modifiedBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidateRejectionSummary` ADD FOREIGN KEY (`rejectById`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidateRejectionSummary` ADD FOREIGN KEY (`candidateRawId`) REFERENCES `CandidateRaw`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidateRejectionSummary` ADD FOREIGN KEY (`createdBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidateRejectionSummary` ADD FOREIGN KEY (`modifiedBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidateVersioning` ADD FOREIGN KEY (`candidateRawId`) REFERENCES `CandidateRaw`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidateVersioning` ADD FOREIGN KEY (`createdBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidateVersioning` ADD FOREIGN KEY (`modifiedBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidateCallCentreHistory` ADD FOREIGN KEY (`candidateVersioningId`) REFERENCES `CandidateVersioning`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidateCallCentreHistory` ADD FOREIGN KEY (`createdBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidateCallCentreHistory` ADD FOREIGN KEY (`modifiedBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Candidate` ADD FOREIGN KEY (`createdBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Candidate` ADD FOREIGN KEY (`modifiedBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Candidate` ADD FOREIGN KEY (`modifiedBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidateOther` ADD FOREIGN KEY (`candidateId`) REFERENCES `Candidate`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidateOther` ADD FOREIGN KEY (`createdBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidateOther` ADD FOREIGN KEY (`modifiedBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidateTraining` ADD FOREIGN KEY (`candidateId`) REFERENCES `Candidate`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidateTraining` ADD FOREIGN KEY (`skillId`) REFERENCES `Skill`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidateTraining` ADD FOREIGN KEY (`createdBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidateTraining` ADD FOREIGN KEY (`modifiedBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidateJobPreference` ADD FOREIGN KEY (`candidateId`) REFERENCES `Candidate`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidateJobPreference` ADD FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidateJobPreference` ADD FOREIGN KEY (`skill1`) REFERENCES `Skill`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidateJobPreference` ADD FOREIGN KEY (`skill2`) REFERENCES `Skill`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidateJobPreference` ADD FOREIGN KEY (`createdBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidateJobPreference` ADD FOREIGN KEY (`modifiedBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Category` ADD FOREIGN KEY (`industryId`) REFERENCES `Industry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Category` ADD FOREIGN KEY (`createdBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Category` ADD FOREIGN KEY (`modifiedBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Agent` ADD FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Agent` ADD FOREIGN KEY (`createdBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Agent` ADD FOREIGN KEY (`modifiedBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Customer` ADD FOREIGN KEY (`createdBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Customer` ADD FOREIGN KEY (`modifiedBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerLogin` ADD FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerLogin` ADD FOREIGN KEY (`createdBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerLogin` ADD FOREIGN KEY (`modifiedBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerSubscription` ADD FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerSubscription` ADD FOREIGN KEY (`createdBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerSubscription` ADD FOREIGN KEY (`modifiedBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerToken` ADD FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerToken` ADD FOREIGN KEY (`createdBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerToken` ADD FOREIGN KEY (`modifiedBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Company` ADD FOREIGN KEY (`industryId`) REFERENCES `Industry`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Company` ADD FOREIGN KEY (`createdBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Company` ADD FOREIGN KEY (`modifiedBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidateWorkHistory` ADD FOREIGN KEY (`candidateId`) REFERENCES `Candidate`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidateWorkHistory` ADD FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidateWorkHistory` ADD FOREIGN KEY (`createdBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidateWorkHistory` ADD FOREIGN KEY (`modifiedBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SkillOnCandidateWorkHistory` ADD FOREIGN KEY (`candidateWorkHistoryId`) REFERENCES `CandidateWorkHistory`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SkillOnCandidateWorkHistory` ADD FOREIGN KEY (`skillId`) REFERENCES `Skill`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SkillOnCandidateWorkHistory` ADD FOREIGN KEY (`createdBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SkillOnCandidateWorkHistory` ADD FOREIGN KEY (`modifiedBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

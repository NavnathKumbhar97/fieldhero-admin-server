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
    `startDate` DATE NOT NULL,
    `endDate` DATE NOT NULL,
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
    `categoryId` INTEGER,
    `preferLocation1` VARCHAR(80),
    `preferLocation2` VARCHAR(80),
    `preferLocation3` VARCHAR(80),
    `skill1` INTEGER,
    `skill2` INTEGER,
    `lastCompany` VARCHAR(100),
    `designation` VARCHAR(80),
    `startDate` DATE NOT NULL,
    `endDate` DATE NOT NULL,
    `jobDescription` VARCHAR(200),
    `createdOn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedOn` DATETIME(3) NOT NULL,
    `createdBy` INTEGER,
    `modifiedBy` INTEGER,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
ALTER TABLE `CandidateJobPreference` ADD FOREIGN KEY (`skill1`) REFERENCES `Skill`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidateJobPreference` ADD FOREIGN KEY (`skill2`) REFERENCES `Skill`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidateJobPreference` ADD FOREIGN KEY (`createdBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidateJobPreference` ADD FOREIGN KEY (`modifiedBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

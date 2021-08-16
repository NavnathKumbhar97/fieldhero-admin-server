-- CreateTable
CREATE TABLE `CompanyInquiry` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fullName` VARCHAR(100) NOT NULL,
    `designation` VARCHAR(40) NOT NULL,
    `companyName` VARCHAR(80) NOT NULL,
    `contactNo` VARCHAR(10) NOT NULL,
    `email` VARCHAR(40) NOT NULL,
    `query` VARCHAR(500) NOT NULL,
    `status` ENUM('PENDING', 'IN_PROGRESS', 'PROCESSEDS') NOT NULL DEFAULT 'PENDING',
    `comment` VARCHAR(500),
    `createdOn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedOn` DATETIME(3) NOT NULL,
    `createdBy` INTEGER,
    `modifiedBy` INTEGER,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CandidateInquiry` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fullName` VARCHAR(100) NOT NULL,
    `contactNo` VARCHAR(10) NOT NULL,
    `email` VARCHAR(40),
    `jobType` VARCHAR(50),
    `location` VARCHAR(80),
    `status` ENUM('PENDING', 'IN_PROGRESS', 'PROCESSEDS') NOT NULL DEFAULT 'PENDING',
    `comment` VARCHAR(500),
    `createdOn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedOn` DATETIME(3) NOT NULL,
    `createdBy` INTEGER,
    `modifiedBy` INTEGER,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CompanyInquiry` ADD FOREIGN KEY (`createdBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CompanyInquiry` ADD FOREIGN KEY (`modifiedBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidateInquiry` ADD FOREIGN KEY (`createdBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidateInquiry` ADD FOREIGN KEY (`modifiedBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

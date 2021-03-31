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

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Agent` ADD FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Agent` ADD FOREIGN KEY (`createdBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Agent` ADD FOREIGN KEY (`modifiedBy`) REFERENCES `UserLogin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `aadharNo` on the `AgentPricingTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `contactNo2` on the `AgentPricingTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `currAddress` on the `AgentPricingTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `currState` on the `AgentPricingTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `dlNo` on the `AgentPricingTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `AgentPricingTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `expMonths` on the `AgentPricingTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `AgentPricingTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `jobDescription` on the `AgentPricingTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `panNo` on the `AgentPricingTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `permAddress` on the `AgentPricingTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `permCity` on the `AgentPricingTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `permState` on the `AgentPricingTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `permZip` on the `AgentPricingTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `AgentPricingTemplate` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `AgentPricingTemplate` DROP COLUMN `aadharNo`,
    DROP COLUMN `contactNo2`,
    DROP COLUMN `currAddress`,
    DROP COLUMN `currState`,
    DROP COLUMN `dlNo`,
    DROP COLUMN `endDate`,
    DROP COLUMN `expMonths`,
    DROP COLUMN `gender`,
    DROP COLUMN `jobDescription`,
    DROP COLUMN `panNo`,
    DROP COLUMN `permAddress`,
    DROP COLUMN `permCity`,
    DROP COLUMN `permState`,
    DROP COLUMN `permZip`,
    DROP COLUMN `startDate`,
    ADD COLUMN `education` DOUBLE NOT NULL DEFAULT 0;

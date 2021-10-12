/*
  Warnings:

  - You are about to drop the `CandidateJobPreference` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CandidateOther` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CandidateTraining` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `CandidateJobPreference` DROP FOREIGN KEY `CandidateJobPreference_ibfk_1`;

-- DropForeignKey
ALTER TABLE `CandidateJobPreference` DROP FOREIGN KEY `CandidateJobPreference_ibfk_2`;

-- DropForeignKey
ALTER TABLE `CandidateJobPreference` DROP FOREIGN KEY `CandidateJobPreference_ibfk_5`;

-- DropForeignKey
ALTER TABLE `CandidateJobPreference` DROP FOREIGN KEY `CandidateJobPreference_ibfk_6`;

-- DropForeignKey
ALTER TABLE `CandidateJobPreference` DROP FOREIGN KEY `CandidateJobPreference_ibfk_3`;

-- DropForeignKey
ALTER TABLE `CandidateJobPreference` DROP FOREIGN KEY `CandidateJobPreference_ibfk_4`;

-- DropForeignKey
ALTER TABLE `CandidateOther` DROP FOREIGN KEY `CandidateOther_ibfk_1`;

-- DropForeignKey
ALTER TABLE `CandidateOther` DROP FOREIGN KEY `CandidateOther_ibfk_2`;

-- DropForeignKey
ALTER TABLE `CandidateOther` DROP FOREIGN KEY `CandidateOther_ibfk_3`;

-- DropForeignKey
ALTER TABLE `CandidateTraining` DROP FOREIGN KEY `CandidateTraining_ibfk_1`;

-- DropForeignKey
ALTER TABLE `CandidateTraining` DROP FOREIGN KEY `CandidateTraining_ibfk_3`;

-- DropForeignKey
ALTER TABLE `CandidateTraining` DROP FOREIGN KEY `CandidateTraining_ibfk_4`;

-- DropForeignKey
ALTER TABLE `CandidateTraining` DROP FOREIGN KEY `CandidateTraining_ibfk_2`;

-- AlterTable
ALTER TABLE `Candidate` ADD COLUMN `passwordHash` VARCHAR(200);

-- DropTable
DROP TABLE `CandidateJobPreference`;

-- DropTable
DROP TABLE `CandidateOther`;

-- DropTable
DROP TABLE `CandidateTraining`;

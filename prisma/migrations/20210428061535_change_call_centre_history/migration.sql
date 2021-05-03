/*
  Warnings:

  - You are about to drop the column `consentReason` on the `CandidateCallCentreHistory` table. All the data in the column will be lost.
  - You are about to alter the column `callStatus` on the `CandidateCallCentreHistory` table. The data in that column could be lost. The data in that column will be cast from `VarChar(40)` to `Enum("CandidateCallCentreHistory_callStatus")`.

*/
-- AlterTable
ALTER TABLE `CandidateCallCentreHistory` DROP COLUMN `consentReason`,
    ADD COLUMN     `industry` BOOLEAN,
    ADD COLUMN     `category` BOOLEAN,
    ADD COLUMN     `fullName` BOOLEAN,
    ADD COLUMN     `dob` BOOLEAN,
    ADD COLUMN     `gender` BOOLEAN,
    ADD COLUMN     `permAddress` BOOLEAN,
    ADD COLUMN     `permCity` BOOLEAN,
    ADD COLUMN     `permState` BOOLEAN,
    ADD COLUMN     `permCountry` BOOLEAN,
    ADD COLUMN     `permZip` BOOLEAN,
    ADD COLUMN     `currAddress` BOOLEAN,
    ADD COLUMN     `currCity` BOOLEAN,
    ADD COLUMN     `currState` BOOLEAN,
    ADD COLUMN     `currCountry` BOOLEAN,
    ADD COLUMN     `currZip` BOOLEAN,
    ADD COLUMN     `email1` BOOLEAN,
    ADD COLUMN     `email2` BOOLEAN,
    ADD COLUMN     `contactNo1` BOOLEAN,
    ADD COLUMN     `contactNo2` BOOLEAN,
    ADD COLUMN     `aadharNo` BOOLEAN,
    ADD COLUMN     `panNo` BOOLEAN,
    ADD COLUMN     `dlNo` BOOLEAN,
    ADD COLUMN     `registrationStatus` BOOLEAN,
    ADD COLUMN     `expYears` BOOLEAN,
    ADD COLUMN     `expMonths` BOOLEAN,
    ADD COLUMN     `preferLocation1` BOOLEAN,
    ADD COLUMN     `preferLocation2` BOOLEAN,
    ADD COLUMN     `preferLocation3` BOOLEAN,
    ADD COLUMN     `skill1` BOOLEAN,
    ADD COLUMN     `skill2` BOOLEAN,
    ADD COLUMN     `primaryLanguage` BOOLEAN,
    ADD COLUMN     `secondaryLanguage` BOOLEAN,
    ADD COLUMN     `thirdLanguage` BOOLEAN,
    ADD COLUMN     `lastCompany` BOOLEAN,
    ADD COLUMN     `designation` BOOLEAN,
    ADD COLUMN     `startDate` BOOLEAN,
    ADD COLUMN     `endDate` BOOLEAN,
    ADD COLUMN     `jobDescription` BOOLEAN,
    MODIFY `callStatus` ENUM('BUSY', 'CALL_BACK', 'COMPLETED', 'DISCONNECTED', 'HALF_DETAILS', 'NOT_INTERESTED', 'NOT_REACHABLE', 'RINGING', 'SWITCH_OFF', 'WRONG_NO');

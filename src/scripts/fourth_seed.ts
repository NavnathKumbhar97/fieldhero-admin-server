import { PrismaClient } from "@prisma/client"
// local import
import { AskConfirmation } from "./helper"

const prisma = new PrismaClient()

const main = async () => {
    const answer = await AskConfirmation()
    if (answer) {
        //
        await prisma.$transaction([
            prisma.emailTemplate.createMany({
                data: [
                    // {
                    //     id: 1,
                    //     templateId: "FHMSS_001",
                    //     template: `<mjml>
                    //     <mj-body>
                    //       <mj-section>
                    //         <mj-column border="black">
                    //           <mj-divider border-color="{style.borderColor}"></mj-divider>
                    //           <mj-image href="https://fieldhero.in" target="_blank" src="cid:fh_logo_unique" height="100px" width="100px"></mj-image>
                    //         </mj-column>
                    //       </mj-section>
                    //       <mj-section>
                    //         <mj-column>
                    //           <mj-text font-size="20px">New Candidate Inquiry</mj-text>
                    //           <mj-text>Inquiry ID: <strong>{inquiryId}</strong>	</mj-text>
                    //           <mj-text>Name: <strong>{name}</strong></mj-text>
                    //           <mj-text>Contact no: <b>{contact}</b></mj-text>
                    //           <mj-text>Email: <b>{email}</b></mj-text>
                    //           <mj-text>Job Type: <b>{jobType}</b></mj-text>
                    //           <mj-text>Location: <b>{location}</b></mj-text>
                    //           <mj-text>Please check the portal for the more details.</mj-text>
                    //           <mj-text>Attachment won't be available on the portal.</mj-text>
                    //           <mj-divider border-color="{style.borderColor}"></mj-divider>
                    //         </mj-column>
                    //       </mj-section>
                    //     </mj-body>
                    //   </mjml>`,
                    //     note:
                    //         "FHMSS - FieldHero Main Site Server\n" +
                    //         "Subject - [#CANINQ-{inquiryCreated.id}] New Candidate Inquiry Generated\n" +
                    //         "When new candidate inquiry created from FieldHero main site, send this email to admin.",
                    //     createdBy: 1,
                    //     modifiedBy: 1,
                    // },
                    {
                        id: 2,
                        templateId: "FHMSS_002",
                        template: `<mjml>
                        <mj-body>
                          <mj-section>
                            <mj-column border="black">
                              <mj-divider border-color="{style.borderColor}"></mj-divider>
                              <mj-image href="https://fieldhero.in" target="_blank" src="cid:fh_logo_unique" height="100px" width="100px"></mj-image>
                            </mj-column>
                          </mj-section>
                          <mj-section>
                            <mj-column>
                              <mj-text font-size="20px">New Company Inquiry</mj-text>
                              <mj-text>Inquiry ID: <strong>{inquiryId}</strong>	</mj-text>
                              <mj-text>Name: <strong>{name}</strong></mj-text>
                              <mj-text>Designation: <b>{designation}</b></mj-text>
                              <mj-text>Company: <b>{company}</b></mj-text>
                              <mj-text>Contact no: <b>{contact}</b></mj-text>
                              <mj-text>Email: <b>{email}</b></mj-text>
                              <mj-text>Query: <b>{query}</b></mj-text>
                              <mj-text>Please check the portal for the more details.</mj-text>
                              <mj-divider border-color="{style.borderColor}"></mj-divider>
                            </mj-column>
                          </mj-section>
                        </mj-body>
                      </mjml>`,
                        note:
                            "FHMSS - FieldHero Main Site Server\n" +
                            "Subject - [#COMINQ-{inquiryCreated.id}] New Company Inquiry Generated\n" +
                            "When new company inquiry created from FieldHero main site, send this email to admin.",
                        createdBy: 1,
                        modifiedBy: 1,
                    },
                ],
            }),
        ])
        console.log("Fourth seed done successful")
    }
    process.exit(0)
}
main()

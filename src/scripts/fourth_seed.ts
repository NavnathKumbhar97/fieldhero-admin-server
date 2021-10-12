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
                    // {
                    //     id: 2,
                    //     templateId: "FHMSS_002",
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
                    //           <mj-text font-size="20px">New Company Inquiry</mj-text>
                    //           <mj-text>Inquiry ID: <strong>{inquiryId}</strong>	</mj-text>
                    //           <mj-text>Name: <strong>{name}</strong></mj-text>
                    //           <mj-text>Designation: <b>{designation}</b></mj-text>
                    //           <mj-text>Company: <b>{company}</b></mj-text>
                    //           <mj-text>Contact no: <b>{contact}</b></mj-text>
                    //           <mj-text>Email: <b>{email}</b></mj-text>
                    //           <mj-text>Query: <b>{query}</b></mj-text>
                    //           <mj-text>Please check the portal for the more details.</mj-text>
                    //           <mj-divider border-color="{style.borderColor}"></mj-divider>
                    //         </mj-column>
                    //       </mj-section>
                    //     </mj-body>
                    //   </mjml>`,
                    //     note:
                    //         "FHMSS - FieldHero Main Site Server\n" +
                    //         "Subject - [#COMINQ-{inquiryCreated.id}] New Company Inquiry Generated\n" +
                    //         "When new company inquiry created from FieldHero main site, send this email to admin.",
                    //     createdBy: 1,
                    //     modifiedBy: 1,
                    // },
                    {
                        id: 3,
                        templateId: "FHADS_001",
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
                              <mj-text font-size="20px">Welcome to FieldHero</mj-text>
                            </mj-column>
                          </mj-section>
                          <mj-section>
                            <mj-column>
                              <mj-text>Hi <strong>{fullName}</strong>,</mj-text>
                              <mj-text>Welcome to <a href="https://fieldhero.in" target="_blank">FieldHero</a>!</mj-text>
                              <mj-text>Please find your credentials below to login.</mj-text>
                              <mj-text>Username: Use your <strong>primary contact no</strong> or <strong>primary email address</strong></mj-text>
                              <mj-text>Password: <strong>{password}</strong></mj-text>
                              <mj-text>Link to <a href="https://fieldhero.in/candidate/login" target="_blank">Check Profile</a></mj-text>
                              <mj-text>Link to <a href="https://fieldhero.in/terms" target="_blank">Terms and Conditions</a></mj-text>
                            </mj-column>
                          </mj-section>
                          <mj-section>
                            <mj-column>
                              <mj-text>Click on the links given to check your details and our Terms and Conditions. For any changes or cancellation write to <a href="mailto:contact@fieldhero.in" target="_blank">contact@fieldhero.in</a> or contact us on <a href="tel:+919879254550" target="_blank">+91-98792-54550 </a></mj-text>
                              <mj-divider border-color="{style.borderColor}"></mj-divider>
                            </mj-column>
                          </mj-section>
                        </mj-body>
                      </mjml>`,
                        note:
                            "FHADS - FieldHero Admin Server\n" +
                            "Subject - FieldHero -  Welcome to FieldHero\n" +
                            "When batch get approved, credentials for candidates will be generated and email will be sent",
                        createdBy: 1,
                        modifiedBy: 1,
                    },
                    {
                        id: 4,
                        templateId: "FHADS_002",
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
                              <mj-text font-size="20px">Batch Processed</mj-text>
                              <mj-text font-size="14px" font-weight="bold">Hello {fullName},</mj-text>
                            </mj-column>
                          </mj-section>
                          <mj-section>
                            <mj-column>
                              <mj-text>Your uploaded batch has been processed successfully.</mj-text>
                              <mj-text>Please check the details below:</mj-text>
                              <mj-text>Batch no: <strong>{batchNo}</strong></mj-text>
                              <mj-text>Count: <strong>{count}</strong></mj-text>
                              <mj-text>Approved: <strong>{approved}</strong></mj-text>
                              <mj-text>Rejected: <strong>{rejected}</strong></mj-text>
                              <mj-text>Payable Amount: <strong>{payableAmount} INR</strong></mj-text>
                              <mj-text>Please find rejected summary on the portal.</mj-text>
                              <mj-text><a href="{config.AGENT_PORTAL_URL}" target="_blank">Click here</a> to login to portal</mj-text>
                              <mj-divider border-color="{style.borderColor}"></mj-divider>
                            </mj-column>
                          </mj-section>
                        </mj-body>
                      </mjml>`,
                        note:
                            "FHADS - FieldHero Admin Server\n" +
                            "Subject - FieldHero - Batch Processed\n" +
                            "When batch get approved, send an email to agent with all the details",
                        createdBy: 1,
                        modifiedBy: 1,
                    },
                    {
                        id: 5,
                        templateId: "FHADS_003",
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
                              <mj-text font-size="20px">Account Created</mj-text>
                              <mj-text font-size="14px" font-weight="bold">Hello {fullName},</mj-text>
                              <mj-text font-size="14px" font-weight="bold">Welcome to Fieldhero.</mj-text>
                              <mj-text>Your account has been created successfully.</mj-text>
                              <mj-text>Please find your credentials below.</mj-text>
                              <mj-text>UserName: <b>{email}</b></mj-text>
                              <mj-text>Password: <b>{password}</b></mj-text>
                              <mj-text>You can login using given credentials on the following link:</mj-text>
                              <mj-text><a href="{config.AGENT_PORTAL_URL}" target="_blank">{config.AGENT_PORTAL_URL}</a></mj-text>
                              <mj-divider border-color="{style.borderColor}"></mj-divider>
                            </mj-column>
                          </mj-section>
                        </mj-body>
                        </mjml>`,
                        note:
                            "FHADS - FieldHero Admin Server\n" +
                            "Subject - Fieldhero - Agent - Account Created Successfully\n" +
                            "When an agent get registered system will sent this email to the agent",
                        createdBy: 1,
                        modifiedBy: 1,
                    },
                    {
                        id: 6,
                        templateId: "FHADS_004",
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
                              <mj-text font-size="20px">Password Reset</mj-text>
                              <mj-text font-size="14px" font-weight="bold">Hello {param.fullName},</mj-text>
                              <mj-text>Your password has been reset successfully by the Admin team.</mj-text>
                              <mj-text>Please find your new password below.</mj-text>
                              <mj-text>New Password: <b>{param.password}</b></mj-text>
                              <mj-text>Portal link: <a href="{config.CLIENT_URL}" target="_blank">{config.CLIENT_URL}</a></mj-text>
                              <mj-divider border-color="{style.borderColor}"></mj-divider>
                            </mj-column>
                          </mj-section>
                        </mj-body>
                      </mjml>`,
                        note:
                            "FHADS - FieldHero Admin Server\n" +
                            "Subject - Fieldhero Customer - Password Reset Successfully\n" +
                            "When an admin reset password for the customer from the admin portal, send this email to custommer.",
                        createdBy: 1,
                        modifiedBy: 1,
                    },
                    {
                        id: 7,
                        templateId: "FHADS_005",
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
                              <mj-text font-size="20px">Password Reset</mj-text>
                              <mj-text font-size="14px" font-weight="bold">Hello {param.fullName},</mj-text>
                              <mj-text>Your password has been reset successfully.</mj-text>
                              <mj-text>Please find your new password below.</mj-text>
                              <mj-text>New Password: <b>{param.password}</b></mj-text>
                              <mj-text>Portal link: <a href="{config.CLIENT_URL}" target="_blank">{config.CLIENT_URL}</a></mj-text>
                              <mj-divider border-color="{style.borderColor}"></mj-divider>
                            </mj-column>
                          </mj-section>
                        </mj-body>
                      </mjml>`,
                        note:
                            "FHADS - FieldHero Admin Server\n" +
                            "Subject - Fieldhero Admin - Password Reset Successfully\n" +
                            "When user click on reset password link from email received for forgot password request",
                        createdBy: 1,
                        modifiedBy: 1,
                    },
                    {
                        id: 8,
                        templateId: "FHADS_006",
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
                              <mj-text font-size="20px">Reset password Request</mj-text>
                              <mj-text font-size="14px" font-weight="bold">Hello {param.fullName},</mj-text>
                              <mj-text>We have received your request to reset password. Please confirm it by clicking below button.</mj-text>
                              <mj-button href="{url}" background-color="{style.bgColor}">Reset Password</mj-button>
                              <mj-text>If button don't work for some reason, please click link below.</mj-text>
                              <mj-text font-size="12px"><a href="{url}" target="_blank">{url}</a></mj-text>
                              <mj-text>Portal link: <a href="{config.CLIENT_URL}" target="_blank">{config.CLIENT_URL}</a></mj-text>
                              <mj-divider border-color="{style.borderColor}"></mj-divider>
                            </mj-column>
                          </mj-section>
                        </mj-body>
                      </mjml>`,
                        note:
                            "FHADS - FieldHero Admin Server\n" +
                            "Subject - Fieldhero Admin - Reset Password Request\n" +
                            "When user request for forgot password from public link, send this email to user",
                        createdBy: 1,
                        modifiedBy: 1,
                    },
                    {
                        id: 9,
                        templateId: "FHADS_007",
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
                              <mj-text font-size="20px">Account Created</mj-text>
                              <mj-text font-size="14px" font-weight="bold">Hello {fullName},</mj-text>
                              <mj-text>Congratulations!! Your account has been created successfully.</mj-text>
                              <mj-text>Please find your credentials below.</mj-text>
                              <mj-text>UserName: <b>{email}</b></mj-text>
                              <mj-text>Password: <b>{password}</b></mj-text>
                              <mj-text>You can login using given credentials on the following link:</mj-text>
                              <mj-text><a href="{config.CLIENT_URL}" target="_blank">{config.CLIENT_URL}</a></mj-text>
                              <mj-divider border-color="{style.borderColor}"></mj-divider>
                            </mj-column>
                          </mj-section>
                        </mj-body>
                      </mjml>`,
                        note:
                            "FHADS - FieldHero Admin Server\n" +
                            "Subject - Fieldhero Admin - Your Password\n" +
                            "When a new user is created in the system, send email to new user",
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

import * as config from "../config"

const style = {
    color: "#B84649",
    borderColor: "#B84649",
    bgColor: "#B84649",
}

interface IEmailTemplate {
    id: number
    template: string
}

const generatePassword = (
    fullName: string,
    email: string,
    password: string
): IEmailTemplate => {
    return {
        id: 9,
        template: `<mjml>
      <mj-body>
        <mj-section>
          <mj-column border="black">
            <mj-divider border-color="${style.borderColor}"></mj-divider>
            <mj-image href="https://fieldhero.in" target="_blank" src="cid:fh_logo_unique" height="100px" width="100px"></mj-image>
          </mj-column>
        </mj-section>
        <mj-section>
          <mj-column>
            <mj-text font-size="20px">Account Created</mj-text>
            <mj-text font-size="14px" font-weight="bold">Hello ${fullName},</mj-text>
            <mj-text>Congratulations!! Your account has been created successfully.</mj-text>
            <mj-text>Please find your credentials below.</mj-text>
            <mj-text>UserName: <b>${email}</b></mj-text>
            <mj-text>Password: <b>${password}</b></mj-text>
            <mj-text>You can login using given credentials on the following link:</mj-text>
            <mj-text><a href="${config.CLIENT_URL}" target="_blank">${config.CLIENT_URL}</a></mj-text>
            <mj-divider border-color="${style.borderColor}"></mj-divider>
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>`,
    }
}

interface IForgotPasswordEmailParam {
    fullName: string
    email: string
    token: string
}
const generateForgotPasswordEmail = (
    param: IForgotPasswordEmailParam
): IEmailTemplate => {
    const url = `${config.CLIENT_URL}/reset-password?token=${param.token}&email=${param.email}`
    return {
        id: 8,
        template: `<mjml>
      <mj-body>    
        <mj-section>
          <mj-column border="black">        
            <mj-divider border-color="${style.borderColor}"></mj-divider>
            <mj-image href="https://fieldhero.in" target="_blank" src="cid:fh_logo_unique" height="100px" width="100px"></mj-image>
          </mj-column>
        </mj-section>
        <mj-section>
          <mj-column>
            <mj-text font-size="20px">Reset password Request</mj-text>
            <mj-text font-size="14px" font-weight="bold">Hello ${param.fullName},</mj-text>
            <mj-text>We have received your request to reset password. Please confirm it by clicking below button.</mj-text>
            <mj-button href="${url}" background-color="${style.bgColor}">Reset Password</mj-button>
            <mj-text>If button don't work for some reason, please click link below.</mj-text>
            <mj-text font-size="12px"><a href="${url}" target="_blank">${url}</a></mj-text>
            <mj-text>Portal link: <a href="${config.CLIENT_URL}" target="_blank">${config.CLIENT_URL}</a></mj-text>
            <mj-divider border-color="${style.borderColor}"></mj-divider>
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>`,
    }
}

//
interface IResetPasswordSuccessEmailparam {
    fullName: string
    password: string
}
const generateResetPasswordSuccessEmail = (
    param: IResetPasswordSuccessEmailparam
): IEmailTemplate => {
    return {
        id: 7,
        template: `<mjml>
      <mj-body>    
        <mj-section>
          <mj-column border="black">        
            <mj-divider border-color="${style.borderColor}"></mj-divider>
            <mj-image href="https://fieldhero.in" target="_blank" src="cid:fh_logo_unique" height="100px" width="100px"></mj-image>
          </mj-column>
        </mj-section>
        <mj-section>
          <mj-column>
            <mj-text font-size="20px">Password Reset</mj-text>
            <mj-text font-size="14px" font-weight="bold">Hello ${param.fullName},</mj-text>
            <mj-text>Your password has been reset successfully.</mj-text>
            <mj-text>Please find your new password below.</mj-text>
            <mj-text>New Password: <b>${param.password}</b></mj-text>
            <mj-text>Portal link: <a href="${config.CLIENT_URL}" target="_blank">${config.CLIENT_URL}</a></mj-text>
            <mj-divider border-color="${style.borderColor}"></mj-divider>
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>`,
    }
}

//
interface IResetPasswordByAdminSuccessEmailparam {
    fullName: string
    password: string
}
const generateResetPasswordByAdminSuccessEmail = (
    param: IResetPasswordByAdminSuccessEmailparam
): IEmailTemplate => {
    return {
        id: 6,
        template: `<mjml>
      <mj-body>    
        <mj-section>
          <mj-column border="black">        
            <mj-divider border-color="${style.borderColor}"></mj-divider>
            <mj-image href="https://fieldhero.in" target="_blank" src="cid:fh_logo_unique" height="100px" width="100px"></mj-image>
          </mj-column>
        </mj-section>
        <mj-section>
          <mj-column>
            <mj-text font-size="20px">Password Reset</mj-text>
            <mj-text font-size="14px" font-weight="bold">Hello ${param.fullName},</mj-text>
            <mj-text>Your password has been reset successfully by the Admin team.</mj-text>
            <mj-text>Please find your new password below.</mj-text>
            <mj-text>New Password: <b>${param.password}</b></mj-text>
            <mj-text>Portal link: <a href="${config.CLIENT_URL}" target="_blank">${config.CLIENT_URL}</a></mj-text>
            <mj-divider border-color="${style.borderColor}"></mj-divider>
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>`,
    }
}

const createAgent = (
    fullName: string,
    email: string,
    password: string
): IEmailTemplate => {
    return {
        id: 5,
        template: `<mjml>
      <mj-body>
        <mj-section>
          <mj-column border="black">
            <mj-divider border-color="${style.borderColor}"></mj-divider>
            <mj-image href="https://fieldhero.in" target="_blank" src="cid:fh_logo_unique" height="100px" width="100px"></mj-image>
          </mj-column>
        </mj-section>
        <mj-section>
          <mj-column>
            <mj-text font-size="20px">Account Created</mj-text>
            <mj-text font-size="14px" font-weight="bold">Hello ${fullName},</mj-text>
            <mj-text font-size="14px" font-weight="bold">Welcome to Fieldhero.</mj-text>
            <mj-text>Your account has been created successfully.</mj-text>
            <mj-text>Please find your credentials below.</mj-text>
            <mj-text>UserName: <b>${email}</b></mj-text>
            <mj-text>Password: <b>${password}</b></mj-text>
            <mj-text>You can login using given credentials on the following link:</mj-text>
            <mj-text><a href="${config.AGENT_PORTAL_URL}" target="_blank">${config.AGENT_PORTAL_URL}</a></mj-text>
            <mj-divider border-color="${style.borderColor}"></mj-divider>
          </mj-column>
        </mj-section>
      </mj-body>
      </mjml>`,
    }
}

const batchApprovedToAgent = (
    fullName: string,
    batchNo: number,
    count: number,
    approved: number,
    rejected: number,
    payableAmount: number
): IEmailTemplate => {
    return {
        id: 4,
        template: `<mjml>
      <mj-body>
        <mj-section>
          <mj-column border="black">
            <mj-divider border-color="${style.borderColor}"></mj-divider>
            <mj-image href="https://fieldhero.in" target="_blank" src="cid:fh_logo_unique" height="100px" width="100px"></mj-image>
          </mj-column>
        </mj-section>
        <mj-section>
          <mj-column>
            <mj-text font-size="20px">Batch Processed</mj-text>
            <mj-text font-size="14px" font-weight="bold">Hello ${fullName},</mj-text>
          </mj-column>
        </mj-section>
        <mj-section>
          <mj-column>
            <mj-text>Your uploaded batch has been processed successfully.</mj-text>
            <mj-text>Please check the details below:</mj-text>
            <mj-text>Batch no: <strong>${batchNo}</strong></mj-text>
            <mj-text>Count: <strong>${count}</strong></mj-text>
            <mj-text>Approved: <strong>${approved}</strong></mj-text>
            <mj-text>Rejected: <strong>${rejected}</strong></mj-text>
            <mj-text>Payable Amount: <strong>${payableAmount} INR</strong></mj-text>
            <mj-text>Please find rejected summary on the portal.</mj-text>
            <mj-text><a href="${config.AGENT_PORTAL_URL}" target="_blank">Click here</a> to login to portal</mj-text>
            <mj-divider border-color="${style.borderColor}"></mj-divider>
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>`,
    }
}

const welcomeToCandidate = (
    fullName: string,
    password: string
): IEmailTemplate => {
    return {
        id: 3,
        template: `<mjml>
      <mj-body>
        <mj-section>
          <mj-column border="black">
            <mj-divider border-color="${style.borderColor}"></mj-divider>
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
            <mj-text>Hi <strong>${fullName}</strong>,</mj-text>
            <mj-text>Welcome to <a href="https://fieldhero.in" target="_blank">FieldHero</a>!</mj-text>
            <mj-text>Please find your credentials below to login.</mj-text>
            <mj-text>Username: Use your <strong>primary contact no</strong> or <strong>primary email address</strong></mj-text>
            <mj-text>Password: <strong>${password}</strong></mj-text>
            <mj-text>Link to <a href="https://fieldhero.in/candidate/login" target="_blank">Check Profile</a></mj-text>
            <mj-text>Link to <a href="https://fieldhero.in/terms" target="_blank">Terms and Conditions</a></mj-text>
          </mj-column>
        </mj-section>
        <mj-section>
          <mj-column>
            <mj-text>Click on the links given to check your details and our Terms and Conditions. For any changes or cancellation write to <a href="mailto:contact@fieldhero.in" target="_blank">contact@fieldhero.in</a> or contact us on <a href="tel:+919879254550" target="_blank">+91-98792-54550 </a></mj-text>
            <mj-divider border-color="${style.borderColor}"></mj-divider>
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>`,
    }
}

const emailTemplate = {
    generatePassword,
    generateForgotPasswordEmail,
    generateResetPasswordSuccessEmail,
    generateResetPasswordByAdminSuccessEmail,
    createAgent,
    batchApprovedToAgent,
    welcomeToCandidate,
}

export { emailTemplate }

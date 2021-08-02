import * as config from "../config"

const style = {
    color: "#B84649",
    borderColor: "#B84649",
    bgColor: "#B84649",
}

// <mj-image href="https://admin.fieldhero.in" target="_blank" src="https://fieldhero-admin-portal-stage.cloudpass.apexa.in/img/logo.a3b1bafb.png" height="100px" width="100px"></mj-image>

const generatePassword = (
    fullName: string,
    email: string,
    password: string
): string => {
    return `<mjml>
    <mj-body>
      <mj-section>
        <mj-column border="black">
          <mj-divider border-color="${style.borderColor}"></mj-divider>
          <mj-text align="center" font-size="40px" color="${style.color}" font-weight="bold"><a href="${config.CLIENT_URL}" target="_blank" style="text-decoration:none;color:${style.color};">Field Hero - Admin</a></mj-text>
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
  </mjml>`
}

interface IForgotPasswordEmailParam {
    fullName: string
    email: string
    token: string
}
const generateForgotPasswordEmail = (
    param: IForgotPasswordEmailParam
): string => {
    const url = `${config.CLIENT_URL}/reset-password?token=${param.token}&email=${param.email}`
    return `<mjml>
  <mj-body>    
    <mj-section>
      <mj-column border="black">        
        <mj-divider border-color="${style.borderColor}"></mj-divider>
        <mj-text align="center" font-size="40px" color="${style.color}" font-weight="bold"><a href="${config.CLIENT_URL}" target="_blank" style="text-decoration:none;color:${style.color};">Field Hero - Admin</a></mj-text>
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
</mjml>`
}

//
interface IResetPasswordSuccessEmailparam {
    fullName: string
    password: string
}
const generateResetPasswordSuccessEmail = (
    param: IResetPasswordSuccessEmailparam
): string => {
    return `<mjml>
  <mj-body>    
    <mj-section>
      <mj-column border="black">        
        <mj-divider border-color="${style.borderColor}"></mj-divider>
        <mj-text align="center" font-size="40px" color="${style.color}" font-weight="bold"><a href="${config.CLIENT_URL}" target="_blank" style="text-decoration:none;color:${style.color};">Field Hero - Admin</a></mj-text>
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
</mjml>`
}

//
interface IResetPasswordByAdminSuccessEmailparam {
    fullName: string
    password: string
}
const generateResetPasswordByAdminSuccessEmail = (
    param: IResetPasswordByAdminSuccessEmailparam
): string => {
    return `<mjml>
    <mj-body>    
      <mj-section>
        <mj-column border="black">        
          <mj-divider border-color="${style.borderColor}"></mj-divider>
          <mj-text align="center" font-size="40px" color="${style.color}" font-weight="bold"><a href="${config.CLIENT_URL}" target="_blank" style="text-decoration:none;color:${style.color};">Field Hero - Admin</a></mj-text>
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
  </mjml>`
}

const createAgent = (
    fullName: string,
    email: string,
    password: string
): string => {
    return `<mjml>
  <mj-body>
    <mj-section>
      <mj-column border="black">
        <mj-divider border-color="${style.borderColor}"></mj-divider>
        <mj-text align="center" font-size="40px" color="${style.color}" font-weight="bold"><a href="${config.AGENT_PORTAL_URL}" target="_blank" style="text-decoration:none;color:${style.color};">Field Hero - Agent</a></mj-text>
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
  </mjml>`
}

const batchApprovedToAgent = (
    fullName: string,
    batchNo: number,
    count: number,
    approved: number,
    rejected: number,
    payableAmount: number
): string => {
    return `<mjml>
  <mj-body>
    <mj-section>
      <mj-column border="black">
        <mj-divider border-color="${style.borderColor}"></mj-divider>
        <mj-text align="center" font-size="40px" color="${style.color}" font-weight="bold"><a href="${config.AGENT_PORTAL_URL}" target="_blank" style="text-decoration:none;color:${style.color};">FieldHero</a></mj-text>
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
</mjml>`
}

const emailTemplate = {
    generatePassword,
    generateForgotPasswordEmail,
    generateResetPasswordSuccessEmail,
    generateResetPasswordByAdminSuccessEmail,
    createAgent,
    batchApprovedToAgent,
}

export { emailTemplate }

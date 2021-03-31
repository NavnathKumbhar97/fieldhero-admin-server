import * as config from "../config"
const generatePassword = (
    fullName: string,
    email: string,
    password: string
) => {
    return `<mjml>
    <mj-body>
      <mj-section>
        <mj-column border="black">
          <mj-divider border-color="#2A64B5"></mj-divider>
          <mj-text align="center" font-size="40px" color="#2A64B5" font-weight="bold">Field Hero - Admin</mj-text>
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
          <mj-divider border-color="#2A64B5"></mj-divider>
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
const generateForgotPasswordEmail = (param: IForgotPasswordEmailParam) => {
    const url = `${config.CLIENT_URL}/reset-password?token=${param.token}&email=${param.email}`
    return `<mjml>
  <mj-body>    
    <mj-section>
      <mj-column border="black">        
        <mj-divider border-color="#2A64B5"></mj-divider>
        <mj-text align="center" font-size="40px" color="#2A64B5" font-weight="bold">Field Hero - Admin</mj-text>
      </mj-column>
    </mj-section>
    <mj-section>
      <mj-column>
        <mj-text font-size="20px">Reset password Request</mj-text>
        <mj-text font-size="14px" font-weight="bold">Hello ${param.fullName},</mj-text>
        <mj-text>We have received your request to reset password. Please confirm it by clicking below button.</mj-text>
        <mj-button href="${url}" background-color="#2A64B5">Reset Password</mj-button>
        <mj-text>If button don't work for some reason, please click link below.</mj-text>
        <mj-text font-size="12px"><a href="${url}" target="_blank">${url}</a></mj-text>
        <mj-divider border-color="#2A64B5"></mj-divider>
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
) => {
    return `<mjml>
  <mj-body>    
    <mj-section>
      <mj-column border="black">        
        <mj-divider border-color="#2A64B5"></mj-divider>
        <mj-text align="center" font-size="40px" color="#2A64B5" font-weight="bold">Field Hero - Admin</mj-text>
      </mj-column>
    </mj-section>
    <mj-section>
      <mj-column>
        <mj-text font-size="20px">Password Reset</mj-text>
        <mj-text font-size="14px" font-weight="bold">Hello ${param.fullName},</mj-text>
        <mj-text>Your password has been reset successfully.</mj-text>
        <mj-text>Please find your new password below.</mj-text>
        <mj-text>New Password: <b>${param.password}</b></mj-text>
        <mj-divider border-color="#2A64B5"></mj-divider>
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
) => {
    return `<mjml>
    <mj-body>    
      <mj-section>
        <mj-column border="black">        
          <mj-divider border-color="#2A64B5"></mj-divider>
          <mj-text align="center" font-size="40px" color="#2A64B5" font-weight="bold">Field Hero</mj-text>
        </mj-column>
      </mj-section>
      <mj-section>
        <mj-column>
          <mj-text font-size="20px">Password Reset</mj-text>
          <mj-text font-size="14px" font-weight="bold">Hello ${param.fullName},</mj-text>
          <mj-text>Your password has been reset successfully by the Admin team.</mj-text>
          <mj-text>Please find your new password below.</mj-text>
          <mj-text>New Password: <b>${param.password}</b></mj-text>
          <mj-divider border-color="#2A64B5"></mj-divider>
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>`
}

const createAgent = (fullName: string, email: string, password: string) => {
    return `<mjml>
  <mj-body>
    <mj-section>
      <mj-column border="black">
        <mj-divider border-color="#2A64B5"></mj-divider>
        <mj-text align="center" font-size="40px" color="#2A64B5" font-weight="bold">Field Hero - Agent</mj-text>
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
        <mj-divider border-color="#2A64B5"></mj-divider>
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
}

export { emailTemplate }

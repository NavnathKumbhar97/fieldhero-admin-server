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
      <mj-text align="center" font-size="40px" color="#2A64B5" font-weight="bold">Field Hero</mj-text>
      <mj-text font-size="24px" align="center">Your Passsword </mj-text>
      <mj-text font-size="16px" font-weight="bold">Hello ${fullName},</mj-text>
      <mj-text>congratulations !! </mj-text>
      <mj-text>User Registration Successfully.</mj-text>
      <mj-text>Your UserName is ${email} </mj-text>
      <mj-text>Your Password is ${password} </mj-text>
      <mj-divider border-color="#2A64B5"></mj-divider>
    </mj-column>
  </mj-section>
</mj-body>
</mjml>`
}

const emailTemplate = {
  generatePassword
}

export { emailTemplate }

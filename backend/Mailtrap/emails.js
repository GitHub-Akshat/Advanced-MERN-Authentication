const { response } = require("express")
const { VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE } = require("./emailTemplates")
const { sender, MailClient } = require("./mailconfig")

const  sendVerificationEmail = async (email, vt) => {
    const recipient = [{email}]

    try {
        const response = await MailClient.send({
            from: sender,
            to: recipient,
            subject : "Verify your Email",
            html:VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}" , vt),
            category: "Email Verification"
        })
        console.log("Email sent successfully", response);
    } catch (error) {
        console.log("Error sending verification email : ", error)
        throw new Error("Error sending verification email : ", error)
    }
}

const sendWelcomeEmail = async (email, fullname) => {
    const recipient = [{email}];

    try {
        const response =  await MailClient.send({
            from : sender,
            to : recipient,
            template_uuid: "5dac1c35-7f11-4049-a5ae-ef5fe1f18707",
            template_variables: {
                "name": fullname
            }
        })

        console.log("Welcome email sent succesfully", response);

    } 
    catch (error) {
        console.error("Error sending welcome email", error);
        throw new Error("Error sending welcome email:", error);
    }
}

const sendForgetPassword = async(email, resetURL) => {
    const recipient = [{email}];
    try {
        const response = await MailClient.send({
            from: sender,
            to: recipient,
            subject : "RESET PASSWORD",
            html:PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}" , resetURL),
            category: "Password Reset"
        })

        console.log("Password reset Email sent successfully", response);
    } 
    catch (error) {
        console.log("Error sending Password reset email : ", error)
        throw new Error("Error sending Password reset email : ", error)
    }
}

const sendResetSuccessEmail = async(email) => {
    const recipient = [{email}];
    try {
        const response = await MailClient.send({
            from: sender,
            to: recipient,
            subject: "Password Change Successfull",
            html:PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password change Success"
        })
        console.log("Password change Success", response);
    } 
    catch (error) {
        console.error(error)
        res.status(400).json({success:false, message : error.message});
    }
}

module.exports = {
    sendVerificationEmail,
    sendWelcomeEmail,
    sendForgetPassword,
    sendResetSuccessEmail
}
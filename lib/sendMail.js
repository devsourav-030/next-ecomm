import nodemailer from 'nodemailer';

export const sendMailer = async (subject, to, body) => {
    var transporter = nodemailer.createTransport({
        host: process.env.NODEMAILER_HOST,
        port: process.env.NODEMAILER_PORT,
        secure: false,
        auth: {
            user: process.env.NODEMAILER_EMAIL,
            pass: process.env.NODEMAILER_PASSWORD
        }
    })

    const options = {
        form: `"Sourav Basak" <${process.env.NODEMAILER_EMAIL}>`,
        to: to,
        subject: subject,
        html: body
    }

    try {
        await transporter.sendMail(options);
        return { success: true };
    } catch (error) {
        return { success: false, message: error.message };
    }
}
import nodemailer from 'nodemailer';

type EmailOptions = {
    to: string,
    subject: string,
    text: string,
    html?: string,
}

export async function sendEmail({ to, subject, text, html }: EmailOptions) {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT || '587'),
            secure: process.env.EMAIL_SECURE === 'true',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false,
            },
        })

        const info = await transporter.sendMail({
            from: `"Mock API Playground" <${process.env.EMAIL_FROM}>`,
            to,
            subject,
            text,
            html,
        })

        return info
    } catch (err: any) {
        console.log("nodemailer error", err)
    }
}
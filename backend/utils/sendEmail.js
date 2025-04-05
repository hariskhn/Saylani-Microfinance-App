import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, text }) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const info = await transporter.sendMail({
            from: `"Saylani Microfinance" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
        });

        console.log("Email sent: ", info.response);
    } catch (error) {
        console.error("Email send error:", error);
    }
};

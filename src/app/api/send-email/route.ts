import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { to, subject, text, html } = await req.json();

        if (!to || !subject || (!text && !html)) {
            return NextResponse.json(
                { error: "Missing required fields (to, subject, and either text or html)" },
                { status: 400 }
            );
        }

        const transporter = nodemailer.createTransport({
            host: "smtp.hostinger.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        await transporter.sendMail({
            from: "mail@codifiedtech.com",  
            to,
            subject,
            text,
            html,
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Error sending email:", error);
        return NextResponse.json(
            { error: "Failed to send email", details: error.message },
            { status: 500 }
        );
    }
}


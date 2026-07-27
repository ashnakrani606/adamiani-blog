import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});


export async function POST(req: Request) {
  try {
    const body = await req.json();

    const submittedAt = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Tbilisi",
        dateStyle: "full",
        timeStyle: "medium",
    });

    // Save in Supabase
    const { error } = await supabase.from("waitlist").insert([body]);

    if (error && error.code !== "23505") {
      return NextResponse.json(
        {
          message: error.message,
        },
        { status: 500 }
      );
    }

    const firstName = body.name?.trim().split(/\s+/)[0] || "there";
    
    // Send Email
    await transporter.sendMail({
      from: `Adamiani <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: "New Waitlist Registration",
      html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Early Access Registration</title>
        </head>
        <body style="margin:0;padding:0;background:#f5f7fb;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f7fb;padding:40px 20px;">
            <tr>
              <td align="center">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background:#ffffff;border-radius:12px;border:1px solid #e5e7eb;overflow:hidden;">
                      <tr>
                        <td style="background:#1e6b8f;padding:28px;text-align:center;">
                          <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">
                            Adamiani
                          </h1>
                          <p style="margin:8px 0 0;color:#ffffff;font-size:15px;"> New Early Access Registration</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:32px;">
                          <p style="margin:0 0 24px;font-size:16px;line-height:1.6;">
                            A new user has joined the Adamiani Early Access waitlist.
                          </p>
                          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                            <tr>
                              <td style="padding:14px;border-bottom:1px solid #e5e7eb;font-weight:600;width:180px;">Name</td>
                              <td style="padding:14px;border-bottom:1px solid #e5e7eb;">
                              ${body.name}
                              </td>
                            </tr>
                            <tr>
                              <td style="padding:14px;border-bottom:1px solid #e5e7eb;font-weight:600;">Email</td>
                              <td style="padding:14px;border-bottom:1px solid #e5e7eb;">
                              ${body.email}
                              </td>
                            </tr>
                            <tr>
                              <td style="padding:14px;border-bottom:1px solid #e5e7eb;font-weight:600;">Role</td>
                              <td style="padding:14px;border-bottom:1px solid #e5e7eb;">
                                ${body.role}
                              </td>
                            </tr>
                            <tr>
                              <td style="padding:14px;border-bottom:1px solid #e5e7eb;font-weight:600;">User Type</td>
                              <td style="padding:14px;border-bottom:1px solid #e5e7eb;">
                                ${body.user_type}
                              </td>
                            </tr>
                            <tr>
                              <td style="padding:14px;border-bottom:1px solid #e5e7eb;font-weight:600;">Source</td>
                              <td style="padding:14px;border-bottom:1px solid #e5e7eb;">
                              ${body.source}
                              </td>
                            </tr>
                            <tr>
                              <td style="padding:14px;font-weight:600;">
                                Submitted At
                              </td>
                              <td style="padding:14px;">
                              ${submittedAt}
                              </td>
                            </tr>
                          </table>
                        </td>
                    </tr>
                    <tr>
                      <td style="padding:20px 32px;background:#f8fafc;border-top:1px solid #e5e7eb;text-align:center;">
                        <p style="margin:0;color:#64748b;font-size:13px;">This notification was automatically generated by the Adamiani website.</p>
                      </td>
                    </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
      `,
    });

    await transporter.sendMail({
      from: `Adamiani <${process.env.SMTP_USER}>`,
      to: body.email,
      subject: "Welcome to Adamiani Early Access",
      html: `
      <!DOCTYPE html>
        <html>
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Adamiani Early Access</title>
        </head>
        <body style="margin:0;padding:0;background:#f5f7fb;font-family:Arial,Helvetica,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f7fb;padding:40px 20px;">
          <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
              <tr>
                <td style="background:#1e6b8f;padding:28px;text-align:center;">
                <h1 style="margin:0;color:#ffffff;font-size:24px;">Adamiani</h1>
                <p style="margin:8px 0 0;color:#ffffff;font-size:15px;">
                Welcome to Early Access
                </p>
                </td>
              </tr>
              <tr>
                <td style="padding:36px;">
                <p style="font-size:16px;line-height:1.8;">
                Hi <strong style="color:#1e6b8f;">${firstName}</strong>,
                </p>
                <p style="font-size:16px;line-height:1.8;">
                Thank you for joining <strong style="color:#1e6b8f;" >Adamiani Early Access.</strong>
                </p>
                <p style="font-size:16px;line-height:1.8;">
                We're building a clearer, more organized way for people to manage their medical information and healthcare journey.
                </p>
                <p style="font-size:16px;line-height:1.8;">
                We've received your registration and will keep you updated as Adamiani develops.
                </p>
                <p style="font-size:16px;line-height:1.8;">
                Thank you for being one of our early members.
                </p>
                <p style="font-size:16px;line-height:1.8;margin-top:32px;">
                Best regards,<br>
                <strong style="color:#1e6b8f;" >The Adamiani Team</strong>
                </p>
          </td>
              </tr>
              <tr>
                <td style="padding:24px 32px;background:#f8fafc;border-top:1px solid #e5e7eb;text-align:center;">
                  <p style="margin:0 0 10px;font-size:14px;color:#475569;">
                    Need help?
                  </p>
                  <p style="margin:0 0 18px;font-size:14px;">
                    Contact us at
                    <a
                      href="mailto:aleks@adamiani.ai"
                      style="color:#0F172A;font-weight:600;text-decoration:none;">
                      aleks@adamiani.ai
                    </a>
                  </p>
                  <p style="margin:0;font-size:13px;color:#64748b;">
                    © 2026 Adamiani. All rights reserved.
                  </p>
                </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error: any) {
    console.error("API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
        error,
      },
      { status: 500 }
    );
  }
}
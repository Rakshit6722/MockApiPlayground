import { User } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { sendEmail } from "@/utils/email";
import { connectToDb } from "@/lib/mongoose";

export async function POST(req: NextRequest) {
  try {
    try {
      await connectToDb()
    } catch (err: any) {
      console.error("Error in POST /api/auth/forgot-password:", err);
      return NextResponse.json(
        { error: "error connecting to DB" },
        { status: 500 }
      )
    }
    const body = await req.json()
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }


    const user = await User.findOne({
      email: email
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    const resetToken = crypto.randomBytes(32).toString('hex');

    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

    user.resetToken = hashedToken;
    user.resetTokenExpiration = tokenExpiry;
    await user.save();

    const resetLink = `${process.env.PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}&email=${email}`;

    try {
      await sendEmail({
        to: user.email,
        subject: "Password Reset Request",
        text: `You requested a password reset. Click the link below to reset your password:\n\n${resetLink}\n\nIf you did not request this, please ignore this email.`,
        html: `<!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Reset Your Password</title>
            </head>
            <body style="margin: 0; padding: 0; background-color: #0f172a; color: #e2e8f0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
              <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 600px; margin: 0 auto;">
                <tr>
                  <td align="center" style="padding: 40px 20px;">
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color: rgba(30, 41, 59, 0.9); border-radius: 12px; border: 1px solid #1e293b; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);">
                      <!-- Header -->
                      <tr>
                        <td align="center" style="padding: 20px; background: linear-gradient(to right, rgba(37, 99, 235, 0.1), rgba(124, 58, 237, 0.1)); border-bottom: 1px solid #1e293b;">
                          <h1 style="margin: 0; color: #f8fafc; font-size: 24px; font-weight: bold;">Mock API Playground</h1>
                        </td>
                      </tr>
                      
                      <!-- Content -->
                      <tr>
                        <td style="padding: 30px 25px;">
                          <h2 style="margin-top: 0; margin-bottom: 16px; color: #f1f5f9; font-size: 20px; font-weight: 600;">Password Reset</h2>
                          
                          <p style="margin-bottom: 16px; color: #cbd5e1; font-size: 16px; line-height: 1.5;">
                            You requested a password reset for your Mock API Playground account.
                          </p>
                          
                          <p style="margin-bottom: 24px; color: #cbd5e1; font-size: 16px; line-height: 1.5;">
                            Click the button below to set a new password (valid for 1 hour):
                          </p>
                          
                          <div style="text-align: center; margin: 32px 0;">
                            <a href="${resetLink}" style="display: inline-block; background-color: #2563eb; background-image: linear-gradient(to right, #2563eb, #4f46e5); color: white; font-weight: 500; text-decoration: none; text-align: center; padding: 12px 24px; border-radius: 6px; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                              Reset Password
                            </a>
                          </div>
                          
                          <p style="margin-top: 24px; color: #94a3b8; font-size: 14px; line-height: 1.5;">
                            If you didn't request this, you can safely ignore this email.
                          </p>
                        </td>
                      </tr>
                      
                      <!-- Footer -->
                      <tr>
                        <td style="padding: 20px; text-align: center; background-color: rgba(15, 23, 42, 0.5); border-top: 1px solid #1e293b;">
                          <p style="margin: 0; color: #64748b; font-size: 14px;">
                            &copy; 2025 Mock API Playground. All rights reserved.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
            </html>`
      })
    } catch (err) {
      throw new Error(`Error with nodemailer ${err}`)
    }


    return NextResponse.json(
      { message: "Password reset link sent to your email" },
      { status: 200 }
    )

  } catch (err: any) {
    console.error("Error in POST /api/auth/forgot-password:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
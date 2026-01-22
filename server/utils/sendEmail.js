import nodemailer from 'nodemailer';

/**
 * Create and configure nodemailer transporter
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

/**
 * Send OTP email to user
 */
export const sendOTPEmail = async (email, otp) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"NextGenPhoto" <${process.env.SMTP_FROM}>`,
      to: email,
      subject: 'Your OTP Code',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .container {
                background-color: #f4f4f4;
                padding: 30px;
                border-radius: 10px;
              }
              .otp-code {
                font-size: 32px;
                font-weight: bold;
                color: #6366f1;
                text-align: center;
                letter-spacing: 8px;
                margin: 20px 0;
                padding: 20px;
                background-color: #fff;
                border-radius: 5px;
              }
              .footer {
                margin-top: 30px;
                font-size: 12px;
                color: #666;
                text-align: center;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h2>Your OTP Code</h2>
              <p>Your One-Time Password (OTP) for NextGenPhoto is:</p>
              <div class="otp-code">${otp}</div>
              <p>This code will expire in <strong>10 minutes</strong>.</p>
              <p>If you didn't request this code, please ignore this email.</p>
              <div class="footer">
                <p>© NextGenPhoto - All rights reserved</p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
        Your OTP code is: ${otp}
        
        This code will expire in 10 minutes.
        
        If you didn't request this code, please ignore this email.
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email: ', error);
    throw new Error('Failed to send email');
  }
};

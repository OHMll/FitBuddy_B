// src/mailer.ts
import nodemailer from 'nodemailer';

export const sendEmail = async (email: string) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    const mailOptions = {
        from: `"Fitbuddy" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Fibbudy ได้เวลาออกกำลังกาย!!`,
        html: htmlText()
    };

    await transporter.sendMail(mailOptions);

    return "Send"
};

export const htmlText = () => {
    return `<!DOCTYPE html>
    <html lang="th">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>เวลาออกกำลังกายแล้ว! - Fitbuddy</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&display=swap');
    
                body {
                    font-family: 'Prompt', sans-serif;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    margin: 0;
                    padding: 0;
                }
    
                .email-container {
                    max-width: 600px;
                    margin: 20px auto;
                    background-color: #ffffff;
                    border-radius: 15px;
                    overflow: hidden;
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
                }
    
                .email-header {
                    background: linear-gradient(135deg, #00b894 0%, #00a085 100%);
                    padding: 25px;
                    text-align: center;
                    position: relative;
                }
    
                .logo {
                    font-size: 32px;
                    font-weight: 700;
                    color: #ffffff;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
                }
    
                .subtitle {
                    color: #ffffff;
                    font-size: 14px;
                    font-weight: 300;
                    margin-top: 5px;
                    opacity: 0.9;
                }
    
                .email-body {
                    padding: 35px;
                    text-align: center;
                }
    
                .greeting {
                    font-size: 24px;
                    font-weight: 600;
                    color: #2c3e50;
                    margin-bottom: 15px;
                }
    
                .emoji {
                    font-size: 48px;
                    margin: 20px 0;
                }
    
                .message {
                    font-size: 16px;
                    color: #555555;
                    line-height: 1.6;
                    margin-bottom: 25px;
                }
    
                .workout-container {
                    background: linear-gradient(135deg, #e8f8f5 0%, #d1f2eb 100%);
                    border-radius: 12px;
                    padding: 25px;
                    margin: 0 auto 25px;
                    width: 85%;
                    border: 2px solid #00b894;
                    box-shadow: 0 4px 15px rgba(0, 184, 148, 0.2);
                }
    
                .workout-title {
                    font-size: 20px;
                    font-weight: 700;
                    color: #00a085;
                    margin-bottom: 10px;
                }
    
                .workout-details {
                    font-size: 16px;
                    color: #2d3436;
                    font-weight: 500;
                    margin-bottom: 8px;
                }
    
                .workout-time {
                    font-size: 18px;
                    color: #00b894;
                    font-weight: 600;
                    margin-top: 10px;
                }
    
                .motivation {
                    background-color: #f8f9fa;
                    border-left: 4px solid #00b894;
                    padding: 15px;
                    margin: 25px 0;
                    font-style: italic;
                    color: #2d3436;
                    border-radius: 0 8px 8px 0;
                }
    
                .cta-button {
                    display: inline-block;
                    background: linear-gradient(135deg, #00b894 0%, #00a085 100%);
                    color: white;
                    padding: 15px 30px;
                    text-decoration: none;
                    border-radius: 25px;
                    font-weight: 600;
                    font-size: 16px;
                    margin: 20px 0;
                    box-shadow: 0 4px 15px rgba(0, 184, 148, 0.3);
                    transition: all 0.3s ease;
                }
    
                .cta-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(0, 184, 148, 0.4);
                }
    
                .stats-container {
                    display: flex;
                    justify-content: space-around;
                    margin: 25px 0;
                    background-color: #f1f2f6;
                    padding: 20px;
                    border-radius: 10px;
                }
    
                .stat-item {
                    text-align: center;
                }
    
                .stat-number {
                    font-size: 24px;
                    font-weight: 700;
                    color: #00b894;
                }
    
                .stat-label {
                    font-size: 12px;
                    color: #636e72;
                }
    
                .note {
                    font-size: 14px;
                    color: #636e72;
                    margin-top: 25px;
                    line-height: 1.5;
                    padding: 15px;
                    background-color: #f8f9fa;
                    border-radius: 8px;
                }
    
                .email-footer {
                    background: linear-gradient(135deg, #2d3436 0%, #636e72 100%);
                    padding: 25px;
                    text-align: center;
                }
    
                .footer-text {
                    font-size: 12px;
                    color: #ddd;
                    line-height: 1.5;
                }
    
                .social-icons {
                    margin-top: 15px;
                }
    
                .social-icon {
                    display: inline-block;
                    width: 35px;
                    height: 35px;
                    background: linear-gradient(135deg, #00b894 0%, #00a085 100%);
                    border-radius: 50%;
                    margin: 0 8px;
                    color: white;
                    line-height: 35px;
                    font-size: 16px;
                    transition: transform 0.3s ease;
                }
    
                .social-icon:hover {
                    transform: scale(1.1);
                }
    
                .highlight {
                    font-weight: 600;
                    color: #00b894;
                }
    
                @media (max-width: 600px) {
                    .stats-container {
                        flex-direction: column;
                        gap: 15px;
                    }
                    
                    .email-body {
                        padding: 25px 20px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="email-header">
                    <div class="logo">Fitbuddy</div>
                    <div class="subtitle">Your Fitness Companion</div>
                </div>
    
                <div class="email-body">
                    <div class="greeting">สวัสดีนักสู้! 💪</div>
                    
                    <div class="emoji">🏋️‍♀️</div>
    
                    <div class="message">
                        ถึงเวลาออกกำลังกายแล้ว! <span class="highlight">Fitbuddy</span> เตือนคุณว่าวันนี้คุณมีโปรแกรมการออกกำลังกายที่รอคุณอยู่
                    </div>
    
                    <div class="motivation">
                        "ความสำเร็จไม่ได้เกิดขึ้นในข้ามคืน แต่เกิดจากการฝึกฝนอย่างต่อเนื่อง" 🌟
                    </div>
    
                    <a href="#" class="cta-button">🚀 เริ่มออกกำลังกายเลย!</a>
    
                    <div class="note">
                        💡 <strong>เคล็ดลับ:</strong> อย่าลืมดื่มน้ำให้เพียงพอ และวอร์มอัพก่อนเริ่มออกกำลังกายทุกครั้ง<br>
                        หากคุณต้องการเปลี่ยนแปลงโปรแกรม สามารถเข้าไปแก้ไขได้ในแอป Fitbuddy
                    </div>
                </div>
    
                <div class="email-footer">
                    <div class="footer-text">
                        &copy; 2025 Fitbuddy. สงวนลิขสิทธิ์ทั้งหมด<br>
                        ติดตามเราและร่วมชุมชนคนรักสุขภาพ
                    </div>
                    
                    <div class="social-icons">
                        <span class="social-icon">📱</span>
                        <span class="social-icon">💬</span>
                        <span class="social-icon">📧</span>
                    </div>
                </div>
            </div>
        </body>
    </html>`
}
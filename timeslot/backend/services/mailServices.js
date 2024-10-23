const mailer = require('nodemailer')

const transporter = mailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'deepakmanikandan67@gmail.com',
        pass: 'txuy zvjb wdlb ddga'
    }
})

const sendMail = (to, subject, text) => {
    const mailOptions = {
        from: 'deepakmanikandan67@gmail.com',
        to,
        subject,
        text,
        html: `
            <div style="font-family: 'Helvetica', 'Arial', sans-serif; color: #4a4a4a; padding: 20px; background-color: #f9f9f9; border-radius: 10px;">
                <h2 style="color: #2c3e50;">👋 Hey ${to},</h2>
                <p style="font-size: 16px; line-height: 1.6;">
                    We're thrilled to have you back! You've ${subject} into your account. If you didn't log in or noticed any unusual activity, please <a href="mailto:deepaklogo222@gmail.com" style="color: #3498db; text-decoration: none;">let us know</a> right away.
                </p>
                <div style="background-color: #ecf0f1; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #e74c3c;">🎯 Next Steps for You:</h3>
                    <ul style="list-style-type: none; padding-left: 0; font-size: 15px;">
                        <li style="padding: 8px 0;"><strong>🔄 Update your profile:</strong> Keep your information up to date for a personalized experience.</li>
                        <li style="padding: 8px 0;"><strong>✨ Explore new features:</strong> We've introduced some amazing updates since your last visit. Check them out!</li>
                        <li style="padding: 8px 0;"><strong>🔒 Secure your account:</strong> Ensure your password is strong and set up two-factor authentication.</li>
                    </ul>
                </div>
                <p style="font-size: 16px; line-height: 1.6;">
                    Thanks for being a valued member of our community. We can't wait for you to explore all the great things we've been working on!
                </p>
                <div style="text-align: center; margin-top: 20px;">
                    <a href="https://yourapp.com/login" style="background-color: #2ecc71; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                        Explore Now 🚀
                    </a>
                </div>
                <p style="font-size: 14px; color: #95a5a6; margin-top: 30px;">
                    If you need any help, feel free to <a href="mailto:deepaklogo222@gmail.com" style="color: #3498db; text-decoration: none;">reach out to our support team</a>.
                </p>
                <p style="font-size: 14px; color: #95a5a6;">
                    Best regards,<br>Your Company Team
                </p>

            </div>
        `
    }
    

    transporter.sendMail(mailOptions, (error, info) => {
        if(error){
            console.log(error)
        }
        else{
            console.log('Email sent:' + info.response);
            
        }
    })
}

module.exports = {sendMail}
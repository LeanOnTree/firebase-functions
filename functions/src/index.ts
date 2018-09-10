import * as functions from 'firebase-functions';
import * as nodemailer from 'nodemailer';

// Configure the email transport using the default SMTP transport and a GMail account.
// For Gmail, enable these:
// 1. https://www.google.com/settings/security/lesssecureapps
// 2. https://accounts.google.com/DisplayUnlockCaptcha
// For other types of transports such as Sendgrid see https://nodemailer.com/transports/
// TODO: Configure the `gmail.email` and `gmail.password` Google Cloud environment variables.
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const bcc_list = functions.config().bcc.email_list;
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});


// Your company name to include in the emails
// TODO: Change this to your app or company name to customize the email sent.
const APP_NAME = 'Lean On Tree';



// [START sendSupportTicketEmail]
export const sendSupportTicketEmail = functions.database
.ref('/messages/{messageID}')
.onCreate((snapshot,context) => {
// [END onCreateTrigger]
  // [START eventAttributes]
  const QueryData = snapshot.val();
  const name = QueryData.name
  const email = QueryData.email; // The email of the user.
  const userMessage = QueryData.message; // The display name of the user.
  // [END eventAttributes]

  return sendTicketCreationEmail(email, name, userMessage);
});
// [START sendWelcomeEmail]
/**
 * Sends a welcome email to new user.
 */
// [START onCreateTrigger]
async function sendTicketCreationEmail(email, name, userMessage) {
    const MessageHTMLBody = 
`<h3>Hey ${name || ''}!</h3>
<p>Thank you for visiting ${APP_NAME}. This is a system generated email to let you know that we have received your message. Please don't reply to this email. Below is your original message.</p>

<p>
<strong>${userMessage}</strong>
</p>

Thanks,<br/>
${APP_NAME}
`;
  const mailOptions = {
    from: `${APP_NAME}<${gmailEmail}>`,
    to: email,
    bcc: bcc_list,
    subject: `Glad to hear from you - ${APP_NAME}!`,
    html: MessageHTMLBody
  };


  // The user subscribed to the newsletter.

  await mailTransport.sendMail(mailOptions);
}

// Sends a goodbye email to the given user.

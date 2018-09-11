"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const nodemailer = require("nodemailer");
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
exports.sendSupportTicketEmail = functions.database
    .ref('/messages/{messageID}')
    .onCreate((snapshot, context) => {
    // [END onCreateTrigger]
    // [START eventAttributes]
    const QueryData = snapshot.val();
    const name = QueryData.name;
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
function sendTicketCreationEmail(email, name, userMessage) {
    return __awaiter(this, void 0, void 0, function* () {
        const MessageHTMLBody = `<h3>Hey ${name || ''}!</h3>
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
        yield mailTransport.sendMail(mailOptions);
    });
}
// Sends a goodbye email to the given user.
//# sourceMappingURL=index.js.map
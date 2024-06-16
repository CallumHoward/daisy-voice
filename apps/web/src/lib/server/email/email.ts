import { Resend } from "resend";
import { RESEND_API_KEY, EMAIL_FROM, EMAIL_TO } from "$env/static/private";

type Data = {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
};

const resend = new Resend(RESEND_API_KEY);

export function sendMail({
  firstName,
  lastName,
  email: to,
  message: html,
}: Data) {
  const subject = `Web Inquiry: ${firstName} ${lastName}, REPLY: ${to}`;
  return resend.emails.send({ from: EMAIL_FROM, to: EMAIL_TO, subject, html });
}

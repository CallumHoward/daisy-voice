import { Resend } from "resend";
import { RESEND_API_KEY, EMAIL_IN } from "$env/static/private";

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
  email: from,
  message: html,
}: Data) {
  const subject = `Web Inquiry: ${firstName} ${lastName}`;
  return resend.emails.send({ from, to: EMAIL_IN, subject, html });
}

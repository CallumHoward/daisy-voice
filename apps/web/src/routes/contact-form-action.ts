import { sendMail } from "$lib/server/email/email";
import { getErrorMessage } from "$lib/utils/error";
import { fail } from "@sveltejs/kit";

type Data = {
  success: boolean;
  errors: Record<string, string>;
  missing?: string[];
};

type Args = {
  request: Request;
};

export async function handleContactFromAction({ request }: Args) {
  const formData = await request.formData();

  const firstName = String(formData.get("first_name"));
  const lastName = String(formData.get("last_name"));
  const email = String(formData.get("email"));
  const message = String(formData.get("message"));

  const badFields = [firstName, email, message].filter((field) => !field);
  if (badFields.length) {
    return fail(400, { missing: badFields });
  }

  try {
    const response = await sendMail({ firstName, lastName, email, message });
    if (response.error) {
      console.error(response.error);
      throw new Error("Something went wrong, please try again later.");
    }
  } catch (error) {
    return fail(500, { error: getErrorMessage(error) });
  }

  return { success: true };
}

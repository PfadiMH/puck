"use server";
import { FormGroupProps } from "@components/puck/FormGroup";
import { getDocumentComponent } from "@lib/db/database";
import { FormResponse } from "./config/page.config";
import { sendMail } from "./smtp";

export async function handleFormSubmit(formData: FormResponse) {
  const formResponseObject: Record<string, unknown> = {};
  formData.formData.forEach((value, key) => {
    formResponseObject[key] = value;
  });

  const res = await getDocumentComponent<FormGroupProps>(
    formData.pageId,
    formData.componentId
  );
  sendMail(
    res.formRecipientEmail,
    "Form Submission",
    JSON.stringify(formResponseObject, null, 2)
  );
}

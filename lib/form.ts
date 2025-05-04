"use server";
import { FormGroupProps } from "@components/puck/FormGroup";
import { getDocumentComponent, saveFormResponse } from "@lib/db/database";
import { FormResponse } from "./config/page.config";
import { sendMail } from "./smtp";

export type FormResponseWithObject = {
  pageId: string;
  componentId: string;
  formResponseObject: Record<string, unknown>;
};

export async function handleFormSubmit(formData: FormResponse) {
  const formResponseObject: Record<string, unknown> = {};
  formData.formData.forEach((value, key) => {
    formResponseObject[key] = value;
  });
  formData.formResponseObject = formResponseObject;

  const res = await getDocumentComponent<FormGroupProps>(
    formData.pageId,
    formData.componentId
  );
  await saveFormResponse({
    pageId: formData.pageId,
    componentId: formData.componentId,
    formResponseObject: formResponseObject,
  });
  sendMail(
    res.formRecipientEmail,
    "Form Submission",
    JSON.stringify(formResponseObject, null, 2)
  );
}

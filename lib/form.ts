"use server";
import { FormGroupProps } from "@components/puck/FormGroup";
import { getDocumentComponent, saveFormResponse } from "@lib/db/database";
import { sendMail } from "./smtp";

export type FormResponseWithObject = {
  pageId: string;
  componentId: string;
  formResponseObject: Record<string, unknown>;
};

export async function handleFormSubmit(
  pageId: string,
  componentId: string,
  formResponseObject: Record<string, string>
) {
  const res = await getDocumentComponent<FormGroupProps>(pageId, componentId);
  await saveFormResponse(pageId, componentId, formResponseObject);
  await sendMail(
    res.formRecipientEmail,
    "Form Submission",
    JSON.stringify(formResponseObject, null, 2)
  );
}

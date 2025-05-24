"use server";
import { getDocumentComponent, saveFormResponse } from "@lib/db/database";
import { sendMail } from "./smtp";

export type FormResponseWithObject = {
  pageId: string;
  componentId: string;
  formResponseObject: Record<string, unknown>;
};

export type FormResponse = {
  pageId: string;
  componentId: string;
  formData: FormData;
};

export async function handleFormSubmit(
  pageId: string,
  componentId: string,
  data: Record<string, string>
) {
  const res = await getDocumentComponent<"FormGroup">(pageId, componentId);
  await saveFormResponse(pageId, componentId, data);
  await sendMail(
    res.formRecipientEmail,
    "Form Submission",
    JSON.stringify(data, null, 2)
  );
}

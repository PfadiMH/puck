"use server";
import { FormField } from "@components/puck/FormGroup";
import { getDocumentComponent, saveFormResponse } from "@lib/db/database";
import { z } from "zod/v4";
import { sendMail } from "./smtp";

export type FormResponseWithObject = {
  pageId: string;
  componentId: string;
  data: Record<string, unknown>;
};

export type FormResponse = {
  pageId: string;
  componentId: string;
  formData: FormData;
};

export async function createFormSchema(formFields: FormField[]) {
  return z.object(
    Object.fromEntries(
      formFields.map((field) => {
        let fieldschema: z.ZodTypeAny;
        switch (field.type) {
          case "text":
            fieldschema = z.string().min(1).max(100);
            break;
          case "email":
            fieldschema = z.email();
            break;
          case "number":
            fieldschema = z.number();
            break;
          case "tel":
            fieldschema = z.e164();
            break;
          case "url":
            fieldschema = z.url();
            break;
          case "password":
            fieldschema = z.string().min(8).max(256);
            break;
          case "date":
            fieldschema = z.date();
            break;
          case "time":
            fieldschema = z.iso.date();
            break;
          case "color":
            fieldschema = z.string();
            break;
          default:
            fieldschema = z.string().min(1).max(1000);
            break;
        }
        return [field.label, fieldschema];
      })
    )
  );
}

export async function handleFormSubmit(
  pageId: string,
  componentId: string,
  data: Record<string, string>
) {
  const res = await getDocumentComponent<"FormGroup">(pageId, componentId);
  const formSchema = createFormSchema(res.formFields);
  await saveFormResponse(pageId, componentId, data);
  await sendMail(
    res.formRecipientEmail,
    "Form Submission",
    JSON.stringify(data, null, 2)
  );
}

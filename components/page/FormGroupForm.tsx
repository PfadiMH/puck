"use client";
import { toast } from "@components/ui/Toast";
import { usePageId } from "@lib/contexts/page-id-context";
import { handleFormSubmit } from "@lib/form";
import Form from "next/form";
import { PropsWithChildren } from "react";

type FormGroupFormProps = {
  componentId: string;
};

function FormGroupForm({
  componentId,
  children,
}: PropsWithChildren<FormGroupFormProps>) {
  const pageId = usePageId();

  return (
    <Form
      action={async (formData) => {
        toast("Form submitted");
        handleFormSubmit({
          componentId,
          pageId,
          formData,
        });
      }}
    >
      {children}
    </Form>
  );
}

export default FormGroupForm;

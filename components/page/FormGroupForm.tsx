"use client";
import { toast } from "@components/ui/Toast";
import { usePageId } from "@lib/contexts/page-id-context";
import { handleFormSubmit } from "@lib/form";
import { useMutation } from "@tanstack/react-query";
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

  function parseFormData(formData: FormData): Record<string, string> {
    const labelCounts: Record<string, number> = {};
    const formResponseObject: Record<string, string> = {};
    for (const [key, value] of formData.entries()) {
      if (!labelCounts[key]) {
        labelCounts[key] = 1;
        formResponseObject[key] = value as string;
      } else {
        labelCounts[key]++;
        const newKey = `${key} (${labelCounts[key] - 1})`;
        formResponseObject[newKey] = value as string;
      }
    }
    return formResponseObject;
  }

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      handleFormSubmit(pageId, componentId, parseFormData(data)),
    onSuccess: () => {
      toast("Form submitted");
    },
    onError: (error) => {
      toast(`Error submitting form: ${error.message}`);
    },
  });

  return (
    <Form
      action={async (formData) => {
        mutation.mutate(formData);
      }}
    >
      {children}
    </Form>
  );
}

export default FormGroupForm;

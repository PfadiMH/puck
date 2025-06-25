"use client";
import { toast } from "@components/ui/Toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePageId } from "@lib/contexts/page-id-context";
import { handleFormSubmit } from "@lib/form";
import { useMutation } from "@tanstack/react-query";
import Form from "next/form";
import { PropsWithChildren } from "react";
import { useForm } from "react-hook-form";

type FormGroupFormProps = {
  componentId: string;
  formSchema: any;
};

function FormGroupForm({
  componentId,
  children,
  formSchema,
}: PropsWithChildren<FormGroupFormProps>) {
  const pageId = usePageId();

  function parseFormData(formData: FormData): Record<string, string> {
    const labelCounts: Record<string, number> = {};
    const data: Record<string, string> = {};
    for (const [key, value] of formData.entries()) {
      if (!labelCounts[key]) {
        labelCounts[key] = 1;
        data[key] = value as string;
      } else {
        labelCounts[key]++;
        const newKey = `${key} (${labelCounts[key] - 1})`;
        data[newKey] = value as string;
      }
    }
    return data;
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

  const onSubmit = (data: FormData) => {
    console.log("Invoice Data:", data); // Logs validated form data
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  return (
    <Form
      action={() => {}}
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(onSubmit)(); // Executes validation before submission
      }}
    >
      {children}
    </Form>
  );
}

export default FormGroupForm;

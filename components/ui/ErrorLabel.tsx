import cn from "@lib/cn";

type ErrorLabelProps = {
  message?: string;
  className?: string;
};

function ErrorLabel({ message, className }: ErrorLabelProps) {
  return (
    <div className={cn("bg-red-500 text-white p-2 rounded text-sm", className)}>
      {message}
    </div>
  );
}

export default ErrorLabel;

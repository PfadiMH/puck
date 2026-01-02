import { env } from "@lib/env";

export const DevelopmentLoginLink = () => {
  if (env.MOCK_AUTH !== "true" || env.NODE_ENV === "production") {
    return null;
  }

  return (
    <div className="mt-4 p-4 border border-dashed border-gray-300">
      <h3 className="font-bold text-lg">Development Mode</h3>
      <p>Mock Authentication is enabled.</p>
      <a href="/auth/dev/signin" className="underline text-red-600">
        Go to Developer Login
      </a>
    </div>
  );
};

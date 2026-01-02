import { env } from "@lib/env";
import { DevSignInForm } from "./form";

export default function DevSignInPage() {
  if (env.NODE_ENV === "production" && env.MOCK_AUTH !== "true") {
    return <div>Not available in production</div>;
  }

  return <DevSignInForm />;
}

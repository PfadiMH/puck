import { DevSignInForm } from "./form";

export default function DevSignInPage() {
  if (process.env.NODE_ENV === "production" && process.env.MOCK_AUTH !== "true") {
    return <div>Not available in production</div>;
  }

  return <DevSignInForm />;
}

export const DevelopmentLoginLink = () => {
  if (process.env.MOCK_AUTH !== "true" || process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <div style={{ marginTop: "1rem", padding: "1rem", border: "1px dashed #ccc" }}>
      <h3>Development Mode</h3>
      <p>Mock Authentication is enabled.</p>
      <a href="/auth/dev/signin" className="underline text-red-600">Go to Developer Login</a>
    </div>
  );
};

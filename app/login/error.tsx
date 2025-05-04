"use client";
import { NextPage } from "next";
import { useEffect, useState } from "react";

const ErrorPage: NextPage = (error: any) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (error && error.error) {
      setErrorMessage(error.error);
    }
  }, [error]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
      }}
    >
      <h1>Something went wrong</h1>
      <p>
        {errorMessage
          ? `Error: ${errorMessage}`
          : "We encountered an unexpected error. Please try again later."}
      </p>
    </div>
  );
};

export default ErrorPage;

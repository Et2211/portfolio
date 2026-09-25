"use client";

import { useEffect } from "react";

import { StatusAction, StatusPage } from "@/components/StatusPage";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const ErrorPage = ({ error, reset }: ErrorProps): React.ReactElement => {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <StatusPage
      code="500"
      title="Something went wrong"
      message="An unexpected error occurred. Please try again."
    >
      <StatusAction onClick={reset}>Try Again</StatusAction>
      <StatusAction href="/" variant="secondary">
        Go Home
      </StatusAction>
    </StatusPage>
  );
};

export default ErrorPage;

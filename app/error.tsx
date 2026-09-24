"use client";

import Link from "next/link";
import { useEffect } from "react";

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
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-black dark:text-white">
          500
        </h1>
        <h2 className="mb-8 text-2xl font-semibold text-zinc-600 dark:text-zinc-400">
          Something went wrong
        </h2>
        <p className="mb-8 text-zinc-500 dark:text-zinc-500">
          An unexpected error occurred. Please try again.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={reset}
            className="inline-block rounded-lg bg-black px-6 py-3 text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="inline-block rounded-lg border border-zinc-300 px-6 py-3 text-black transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-900"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;

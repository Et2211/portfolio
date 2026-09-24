import Link from "next/link";

const NotFound = (): React.ReactElement => (
  <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
    <div className="text-center">
      <h1 className="mb-4 text-6xl font-bold text-black dark:text-white">
        404
      </h1>
      <h2 className="mb-8 text-2xl font-semibold text-zinc-600 dark:text-zinc-400">
        Page Not Found
      </h2>
      <p className="mb-8 text-zinc-500 dark:text-zinc-500">
        The page you&apos;re looking for doesn&apos;t exist in the CMS.
      </p>
      <Link
        href="/"
        className="inline-block rounded-lg bg-black px-6 py-3 text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
      >
        Go Home
      </Link>
    </div>
  </div>
);

export default NotFound;

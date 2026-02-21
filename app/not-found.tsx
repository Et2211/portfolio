import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-black dark:text-white mb-4">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-zinc-600 dark:text-zinc-400 mb-8">
          Page Not Found
        </h2>
        <p className="text-zinc-500 dark:text-zinc-500 mb-8">
          The page you're looking for doesn't exist in the CMS.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}

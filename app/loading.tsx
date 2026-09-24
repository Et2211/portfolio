const Loading = (): React.ReactElement => (
  <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
    <div className="flex flex-col items-center gap-4">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-200 border-t-black dark:border-zinc-700 dark:border-t-white" />
      <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading…</p>
    </div>
  </div>
);

export default Loading;

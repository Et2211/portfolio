const Loading = (): React.ReactElement => (
  <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-200 dark:border-zinc-700 border-t-black dark:border-t-white" />
      <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading…</p>
    </div>
  </div>
);

export default Loading;

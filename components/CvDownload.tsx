export type CvDownloadBlock = {
  _type: "cvDownload";
  _key?: string;
  heading?: string;
  label?: string;
  fileUrl?: string | null;
};

export const CvDownload = ({
  label = "Download CV",
  fileUrl,
}: CvDownloadBlock) => {
  if (!fileUrl) return null;

  return (
    <div className="flex justify-center my-4">
      <a
        href={fileUrl}
        download
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 hover:bg-white/20 px-5 py-2.5 text-sm font-medium text-white transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        {label}
      </a>
    </div>
  );
};

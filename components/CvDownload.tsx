import { Download } from "lucide-react";

import type { CvDownloadBlock } from "@/types/blocks";

export const CvDownload = ({
  label = "Download CV",
  fileUrl,
}: CvDownloadBlock) => {
  if (!fileUrl) {
    return null;
  }

  return (
    <div className="my-4 flex justify-center">
      <a
        href={fileUrl}
        download
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/20"
      >
        <Download aria-hidden="true" size={16} />
        {label}
      </a>
    </div>
  );
};

import { cn } from "@/lib/utils";
import React, { useCallback } from "react";

interface FolderDropZoneProps {
  onFolderSelect: (files: File[]) => void;
  className?: string;
}

// Add type extension for input element
declare module "react" {
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    directory?: string;
    webkitdirectory?: string;
  }
}

const FolderDropZone = ({ onFolderSelect, className }: FolderDropZoneProps): JSX.Element => {
  const handleFolder = useCallback((files: File[]) => onFolderSelect(files), [onFolderSelect]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const files = Array.from(e.target.files ?? []).filter((file) => file.name.endsWith(".sol"));
    if (files.length) {
      handleFolder(files);
    }
  };
  // don't support drag and drop for folders.
  return (
    <div
      className={cn(
        "relative border-2 border-dashed rounded-lg p-8",
        "transition-colors duration-200",
        "border-gray-700",
        className,
      )}
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        <label
          className={cn(
            "flex items-center justify-center text-base py-2 px-5",
            "bg-linear-to-r from-cyan-500 to-purple-500 text-white rounded-md cursor-pointer",
            "hover:opacity-80 transition-opacity",
          )}
        >
          <span>Choose folder</span>
          <input
            type="file"
            accept=".sol,.rs"
            onChange={handleFileSelect}
            className="hidden"
            multiple
            directory=""
            webkitdirectory=""
          />
        </label>
      </div>
    </div>
  );
};

export default FolderDropZone;

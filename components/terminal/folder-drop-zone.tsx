import { cn } from "@/lib/utils";
import React, { useCallback } from "react";

interface FolderDropZoneProps {
  onFolderSelect: (fileMap: Record<string, File>) => void;
  isDisabled: boolean;
  className?: string;
}

// Add type extension for input element
declare module "react" {
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    directory?: string;
    webkitdirectory?: string;
  }
}

const EXCLUDED_DIRS = ["lib", "node_modules", "vendor", "script", "test"];

const FolderDropZone = ({
  onFolderSelect,
  isDisabled,
  className,
}: FolderDropZoneProps): JSX.Element => {
  const handleFolder = useCallback(
    (fileMap: Record<string, File>) => onFolderSelect(fileMap),
    [onFolderSelect],
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const rawFiles = Array.from(e.target.files ?? []);

    const filteredFiles = rawFiles.filter((file) => {
      if (!file.name.endsWith(".sol")) return false;

      const pathParts = file.webkitRelativePath.split("/");
      return !pathParts.some((part) => EXCLUDED_DIRS.includes(part));
    });

    if (!filteredFiles.length) return;

    const folderName = filteredFiles[0].webkitRelativePath.split("/")[0];
    console.log("Uploading folder:", folderName);

    // Prepare a map of file paths to content
    const fileMap: Record<string, File> = {};
    for (const file of filteredFiles) {
      fileMap[file.webkitRelativePath] = file;
    }

    handleFolder(fileMap);
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
            disabled={isDisabled}
          />
        </label>
      </div>
    </div>
  );
};

export default FolderDropZone;

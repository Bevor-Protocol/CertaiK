import { cn } from "@/lib/utils";
import React, { useCallback, useRef, useState } from "react";

interface FileDropZoneProps {
  onFileSelect: (content: string) => void;
  className?: string;
}

const FileDropZone = ({ onFileSelect, className }: FileDropZoneProps): JSX.Element => {
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);

  const handleFile = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e): void => {
        const content = e.target?.result as string;
        onFileSelect(content);
      };
      reader.readAsText(file);
    },
    [onFileSelect],
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;

    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;

    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      dragCounter.current = 0;

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        if (file.name.endsWith(".sol") || file.name.endsWith(".rs")) {
          handleFile(file);
        }
      }
    },
    [handleFile],
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={cn(
        "relative border-2 border-dashed rounded-lg p-8",
        "transition-colors duration-200",
        isDragging ? "border-cyan-500 bg-cyan-500/10" : "border-gray-700",
        className,
      )}
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="text-center">
          <p className="text-gray-400">Drag and drop your .sol or .rs file here, or</p>
        </div>

        <label
          className={cn(
            "flex items-center justify-center text-base py-2 px-5",
            "bg-linear-to-r from-cyan-500 to-purple-500 text-white rounded-md cursor-pointer",
            "hover:opacity-80 transition-opacity",
          )}
        >
          <span>Choose file</span>
          <input type="file" accept=".sol,.rs" onChange={handleFileSelect} className="hidden" />
        </label>
      </div>
    </div>
  );
};

export default FileDropZone;

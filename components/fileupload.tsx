"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function FileUpload() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    // Here you would implement the actual file upload logic
    // For example, using fetch to send the file to your server
    console.log("Uploading file:", file.name);

    // After successful upload, you might want to process the file
    // and update your application state accordingly
  };

  return (
    <div>
      <label htmlFor="file-upload" className="cursor-pointer">
        <Button asChild>
          <span>Choose File</span>
        </Button>
      </label>
      <input
        id="file-upload"
        type="file"
        onChange={handleFileChange}
        accept=".csv"
        className="hidden"
      />
      {file && (
        <Button onClick={handleUpload} className="ml-4">
          Upload File
        </Button>
      )}
    </div>
  );
}

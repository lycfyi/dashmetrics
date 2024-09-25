"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { parse } from "csv-parse/sync";

interface ParsedData {
  createdDate: Date;
  convertedAmount: number;
  description: string;
  status: string;
  customerEmail: string;
}

export function FileUpload() {
  const [files, setFiles] = useState<File[]>([]);
  const [parsedData, setParsedData] = useState<ParsedData[]>([]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      setFiles(selectedFiles);

      const allParsedData: ParsedData[] = [];

      for (const file of selectedFiles) {
        const content = await readFileContent(file);
        const parsedFileData = parseCSV(content);
        allParsedData.push(...parsedFileData);
      }

      setParsedData(allParsedData);
      console.log("Parsed data:", allParsedData);
      // Here you can perform further processing or send the data to a parent component
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target?.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  };

  const parseCSV = (content: string): ParsedData[] => {
    const records = parse(content, {
      columns: true,
      skip_empty_lines: true,
    });

    return records.map((record: Record<string, string>, index: number) => {
      const row = index + 2; // Adding 2 because of 0-indexing and header row

      const createdDateValue = record["Created date (UTC)"];
      if (typeof createdDateValue !== "string") {
        throw new Error(`Invalid 'Created date (UTC)' format in row ${row}`);
      }
      const createdDate = new Date(createdDateValue);
      if (Number.isNaN(createdDate.getTime())) {
        throw new Error(
          `Invalid date format in 'Created date (UTC)' in row ${row}`
        );
      }

      const convertedAmountValue = record["Converted Amount"];
      if (typeof convertedAmountValue !== "string") {
        throw new Error(`Invalid 'Converted Amount' format in row ${row}`);
      }
      const convertedAmount = Number.parseFloat(convertedAmountValue);
      if (Number.isNaN(convertedAmount)) {
        throw new Error(
          `Invalid number format in 'Converted Amount' in row ${row}`
        );
      }

      return {
        createdDate,
        convertedAmount,
        description: String(record.Description),
        status: String(record.Status),
        customerEmail: String(record["Customer Email"]),
      };
    });
  };

  return (
    <div>
      <label htmlFor="file-upload" className="cursor-pointer">
        <Button asChild>
          <span>Choose Files</span>
        </Button>
      </label>
      <input
        id="file-upload"
        type="file"
        onChange={handleFileChange}
        accept=".csv"
        multiple
        className="hidden"
      />
      {files.length > 0 && (
        <div className="mt-2">
          <p>{files.length} file(s) selected and processed</p>
        </div>
      )}
      {parsedData.length > 0 && (
        <div className="mt-4">
          <p>Processed {parsedData.length} records</p>
        </div>
      )}
    </div>
  );
}

"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { parse } from "csv-parse/sync";

export interface ParsedData {
  createdDate: Date;
  convertedAmount: number;
  convertedAmountRefunded: number;
  description: string;
  status: string;
  customerEmail: string;
}

interface FileUploadProps {
  onDataParsed: (data: ParsedData[]) => void;
}

export function FileUpload({ onDataParsed }: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [failedFiles, setFailedFiles] = useState<string[]>([]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      setFiles(selectedFiles);

      const allParsedData: ParsedData[] = [];
      const failedFileNames: string[] = [];

      for (const file of selectedFiles) {
        try {
          const content = await readFileContent(file);
          const parsedFileData = parseCSV(content, file.name);
          allParsedData.push(...parsedFileData);
        } catch (error) {
          console.error(`Failed to process file: ${file.name}`, error);
          failedFileNames.push(file.name);
        }
      }

      setFailedFiles(failedFileNames);
      onDataParsed(allParsedData);
      console.log("Parsed data:", allParsedData);
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

  const parseCSV = (content: string, fileName: string): ParsedData[] => {
    const records = parse(content, {
      columns: true,
      skip_empty_lines: true,
    });

    return records
      .map((record: Record<string, string>, index: number) => {
        const row = index + 2; // Adding 2 because of 0-indexing and header row

        try {
          const createdDateValue = record["Created date (UTC)"];
          if (typeof createdDateValue !== "string") {
            throw new Error(
              `Invalid 'Created date (UTC)' format in row ${row}`
            );
          }
          const createdDate = new Date(createdDateValue);
          if (Number.isNaN(createdDate.getTime())) {
            throw new Error(
              `Invalid date format in 'Created date (UTC)' in row ${row} ${fileName}`
            );
          }

          const convertedAmount = parseFloatField(
            record["Converted Amount"],
            "Converted Amount",
            row,
            fileName
          );
          const convertedAmountRefunded = parseFloatField(
            record["Converted Amount Refunded"],
            "Converted Amount Refunded",
            row,
            fileName
          );

          return {
            createdDate,
            convertedAmount,
            convertedAmountRefunded,
            description: String(record.Description),
            status: String(record.Status),
            customerEmail: String(record["Customer Email"]),
          };
        } catch (error) {
          console.error(`Error parsing row ${row}:`, error);
          return null;
        }
      })
      .filter((item: unknown): item is ParsedData => item !== null);
  };

  const parseFloatField = (
    value: string,
    fieldName: string,
    row: number,
    fileName: string
  ): number => {
    if (typeof value !== "string") {
      throw new Error(
        `Invalid '${fieldName}' format in row ${row} ${fileName}`
      );
    }
    const parsedValue = Number.parseFloat(value);
    if (Number.isNaN(parsedValue)) {
      console.warn(
        `Invalid number format in '${fieldName}' in row ${row}. ${fileName} Value: "${value}"`
      );
      return 0; // or you can choose to throw an error instead
    }
    return parsedValue;
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
          {failedFiles.length > 0 && (
            <p className="text-red-500">
              Failed to process: {failedFiles.join(", ")}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

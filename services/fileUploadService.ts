import { parse } from "csv-parse/sync";

export interface UploadedFile {
  name: string;
  size: number;
  type: string;
  content: string;
}

export async function uploadFile(file: File): Promise<UploadedFile> {
  // Implement file upload logic here
  // This could involve reading the file and preparing it for processing
  const content = await readFileContent(file);
  return {
    name: file.name,
    size: file.size,
    type: file.type,
    content,
  };
}

export async function processUploadedFile(uploadedFile: UploadedFile) {
  try {
    const parsedData = parseCSV(uploadedFile.content);
    // Further processing...
    return parsedData;
  } catch (error) {
    console.error("Error processing CSV:", error);
    throw error;
  }
}

interface ParsedData {
  createdDate: Date;
  convertedAmount: number;
  description: string;
  status: string;
  customerEmail: string;
}

interface Record {
  [key: string]: unknown;
}

function parseCSV(content: string): ParsedData[] {
  const records = parse(content, {
    columns: true,
    skip_empty_lines: true,
  });

  return records.map((record: Record, index: number) => {
    const row = index + 2; // Adding 2 because of 0-indexing and header row

    // ... existing validation checks ...

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
      status: String(record.Description),
      customerEmail: String(record["Customer Email"]),
    };
  });
}

async function readFileContent(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target?.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
}

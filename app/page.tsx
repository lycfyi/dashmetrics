"use client";

import { useState } from "react";
import { FileUpload } from "@/components/fileupload";
import { ExampleChart } from "@/components/charts/ExampleChart";
import { MRRChart } from "@/components/charts/MRR";
import type { ParsedData } from "@/components/fileupload";

export default function Home() {
  const [parsedData, setParsedData] = useState<ParsedData[]>([]);

  const handleDataParsed = (data: ParsedData[]) => {
    setParsedData(data);
  };

  return (
    <div className="container mx-auto max-w-7xl py-8 px-4 sm:px-6 lg:px-8">
      <section className="mb-16 text-left">
        <p className="text-l mb-8">
          Upload Stripe CSV files to see the dashboard.
        </p>
        <FileUpload onDataParsed={handleDataParsed} />
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {parsedData.length > 0 && <MRRChart data={parsedData} />}
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <ExampleChart />
        </div>
      </div>

      <footer className="mt-16 flex gap-6 flex-wrap items-center justify-center">
        {/* Footer content */}
      </footer>
    </div>
  );
}

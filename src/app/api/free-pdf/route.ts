import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createElement } from "react";
import { FreePdfDocument } from "@/lib/pdf/FreePdfDocument";

export const maxDuration = 60;

export async function GET() {
  const buffer = await renderToBuffer(createElement(FreePdfDocument));
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="top-25-dog-diy-projects.pdf"',
      "Cache-Control": "public, max-age=86400",
    },
  });
}

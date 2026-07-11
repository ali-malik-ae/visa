import { db } from "@/lib/db";
import { applications, documents } from "@/lib/db/schema";
import { makeDocumentKey, uploadDocument } from "@/lib/r2";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png"];
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file");
  const documentType = formData.get("document_type");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (typeof documentType !== "string" || !documentType) {
    return NextResponse.json({ error: "No document_type provided" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "File must be PDF, JPG, or PNG" },
      { status: 422 }
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "File exceeds 5 MB limit" },
      { status: 422 }
    );
  }

  const [app] = await db
    .select({ id: applications.id })
    .from(applications)
    .where(eq(applications.id, id))
    .limit(1);
  if (!app) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  const key = makeDocumentKey(id, documentType, file.name);
  const buffer = Buffer.from(await file.arrayBuffer());

  await uploadDocument(key, buffer, file.type);

  const [doc] = await db
    .insert(documents)
    .values({
      application_id: id,
      document_type: documentType,
      r2_key: key,
      filename: file.name,
      size_bytes: file.size,
    })
    .returning();

  return NextResponse.json({ id: doc.id, filename: doc.filename }, { status: 201 });
}

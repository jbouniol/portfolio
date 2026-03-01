import { NextRequest, NextResponse } from "next/server";
import { getExperienceBySlug, updateExperience, deleteExperience } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { validateExperiencePayload } from "@/lib/admin-validation";

// GET — single experience by slug
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const experience = await getExperienceBySlug(slug);
    if (!experience) {
      return NextResponse.json({ error: "Experience not found" }, { status: 404 });
    }
    return NextResponse.json(experience);
  } catch (error) {
    console.error("[experiences] GET error:", error);
    return NextResponse.json({ error: "Failed to fetch experience" }, { status: 500 });
  }
}

// PUT — update an experience
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const payload = await req.json();
    const validation = validateExperiencePayload(payload, "update");
    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const updates = validation.data;
    if (updates.slug && updates.slug !== slug) {
      return NextResponse.json(
        { error: "Slug cannot be changed from this endpoint" },
        { status: 400 }
      );
    }

    const updated = await updateExperience(slug, updates);

    if (!updated) {
      return NextResponse.json({ error: "Experience not found" }, { status: 404 });
    }

    revalidatePath("/");
    revalidatePath(`/experience/${slug}`, "page");

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[experiences] PUT error:", error);
    return NextResponse.json({ error: "Failed to update experience" }, { status: 500 });
  }
}

// DELETE — remove an experience
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const deleted = await deleteExperience(slug);

    if (!deleted) {
      return NextResponse.json({ error: "Experience not found" }, { status: 404 });
    }

    revalidatePath("/");
    revalidatePath(`/experience/${slug}`, "page");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[experiences] DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete experience" }, { status: 500 });
  }
}

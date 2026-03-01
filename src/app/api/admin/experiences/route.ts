import { NextRequest, NextResponse } from "next/server";
import { getExperiences, addExperience } from "@/lib/db";
import { revalidatePath } from "next/cache";
import type { Experience } from "@/data/experiences";
import { validateExperiencePayload } from "@/lib/admin-validation";

// GET — list all experiences
export async function GET() {
  try {
    const experiences = await getExperiences();
    return NextResponse.json(experiences);
  } catch (error) {
    console.error("[experiences] GET error:", error);
    return NextResponse.json({ error: "Failed to fetch experiences" }, { status: 500 });
  }
}

// POST — create a new experience
export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const validation = validateExperiencePayload(payload, "create");
    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const body = validation.data;
    if (!body.slug || !body.role || !body.company || !body.type) {
      return NextResponse.json(
        { error: "Missing required fields: slug, role, company, type" },
        { status: 400 }
      );
    }

    const existing = await getExperiences();
    if (existing.some((e) => e.slug === body.slug)) {
      return NextResponse.json(
        { error: `Experience with slug "${body.slug}" already exists` },
        { status: 409 }
      );
    }

    const experience: Experience = {
      slug: body.slug,
      updatedAt: new Date().toISOString().split("T")[0],
      role: body.role,
      company: body.company,
      period: body.period || "",
      location: body.location || "",
      type: body.type,
      status: body.status || "draft",
      tagline: body.tagline || "",
      description: body.description || "",
      missions: body.missions || [],
      ...(body.tools?.length && { tools: body.tools }),
      ...(body.isConfidential && { isConfidential: body.isConfidential }),
    };

    await addExperience(experience);
    revalidatePath("/");
    revalidatePath("/experience/[slug]", "page");

    return NextResponse.json(experience, { status: 201 });
  } catch (error) {
    console.error("[experiences] POST error:", error);
    return NextResponse.json({ error: "Failed to create experience" }, { status: 500 });
  }
}

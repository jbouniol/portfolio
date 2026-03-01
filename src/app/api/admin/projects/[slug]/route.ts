import { NextRequest, NextResponse } from "next/server";
import { getProjectBySlug, updateProject, deleteProject } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { validateProjectPayload } from "@/lib/admin-validation";

// GET — single project by slug
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const project = await getProjectBySlug(slug);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json(project);
  } catch (error) {
    console.error("[projects] GET error:", error);
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}

// PUT — update a project
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const payload = await req.json();
    const validation = validateProjectPayload(payload, "update");
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

    const updated = await updateProject(slug, updates);

    if (!updated) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    revalidatePath("/");
    revalidatePath(`/projects/${slug}`, "page");

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[projects] PUT error:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

// DELETE — remove a project
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const deleted = await deleteProject(slug);

    if (!deleted) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    revalidatePath("/");
    revalidatePath(`/projects/${slug}`, "page");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[projects] DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}

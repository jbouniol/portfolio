import { NextRequest, NextResponse } from "next/server";
import { getProjects, addProject } from "@/lib/db";
import { revalidatePath } from "next/cache";
import type { Project } from "@/data/projects";

// GET — list all projects
export async function GET() {
  try {
    const projects = await getProjects();
    return NextResponse.json(projects);
  } catch (error) {
    console.error("[projects] GET error:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

// POST — create a new project
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Basic validation
    if (!body.slug || !body.title || !body.company || !body.category) {
      return NextResponse.json(
        { error: "Missing required fields: slug, title, company, category" },
        { status: 400 }
      );
    }

    // Check for duplicate slug
    const existing = await getProjects();
    if (existing.some((p) => p.slug === body.slug)) {
      return NextResponse.json(
        { error: `Project with slug "${body.slug}" already exists` },
        { status: 409 }
      );
    }

    const project: Project = {
      slug: body.slug,
      updatedAt: new Date().toISOString().split("T")[0],
      title: body.title,
      company: body.company,
      tagline: body.tagline || "",
      tags: body.tags || [],
      context: body.context || "",
      problem: body.problem || "",
      data: body.data || "",
      method: body.method || "",
      result: body.result || "",
      impact: body.impact || "",
      year: body.year || "",
      duration: body.duration || "",
      category: body.category,
      ...(body.canvaEmbedUrl && { canvaEmbedUrl: body.canvaEmbedUrl }),
      ...(body.githubUrl && { githubUrl: body.githubUrl }),
      ...(body.isPrivate && { isPrivate: body.isPrivate }),
      ...(body.isNDA && { isNDA: body.isNDA }),
      ...(body.badge && { badge: body.badge }),
      ...(body.contributors?.length && { contributors: body.contributors }),
    };

    await addProject(project);
    revalidatePath("/");
    revalidatePath("/projects/[slug]", "page");

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("[projects] POST error:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}

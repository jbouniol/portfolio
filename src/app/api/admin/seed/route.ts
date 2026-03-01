import { NextResponse } from "next/server";
import { seedDatabaseWithMode } from "@/lib/db";

// POST — Sync static defaults into KV (non-destructive only)
export async function POST() {
  try {
    const result = await seedDatabaseWithMode({ mode: "merge" });
    const message = `Sync done: +${result.addedProjects} projects, +${result.addedExperiences} experiences (existing content preserved)`;
    return NextResponse.json({
      success: true,
      message,
      ...result,
    });
  } catch (error) {
    console.error("[seed] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Seed failed" },
      { status: 500 }
    );
  }
}

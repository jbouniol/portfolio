import { NextResponse } from "next/server";
import { seedDatabase } from "@/lib/db";

// POST — Seed the database with static data (one-shot setup)
export async function POST() {
  try {
    const result = await seedDatabase();
    return NextResponse.json({
      success: true,
      message: `Seeded ${result.projects} projects and ${result.experiences} experiences`,
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

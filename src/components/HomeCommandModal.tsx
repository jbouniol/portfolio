"use client";

import CommandModal from "@/components/CommandModal";

// No pageContext on the homepage — context is only meaningful on
// project / experience detail pages.
export default function HomeCommandModal() {
  return <CommandModal pageContext="" />;
}

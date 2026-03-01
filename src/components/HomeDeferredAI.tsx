"use client";

import dynamic from "next/dynamic";

const HomeCommandModal = dynamic(() => import("@/components/HomeCommandModal"), {
  ssr: false,
});

const AISearch = dynamic(() => import("@/components/AISearch"), {
  ssr: false,
});

export default function HomeDeferredAI() {
  return (
    <>
      <HomeCommandModal />
      <AISearch />
    </>
  );
}

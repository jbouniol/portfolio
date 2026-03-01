import { Suspense } from "react";
import AIPrefillClient from "./AIPrefillClient";

export default function AIPrefillPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-zinc-600 border-t-purple-400" />
        </div>
      }
    >
      <AIPrefillClient />
    </Suspense>
  );
}

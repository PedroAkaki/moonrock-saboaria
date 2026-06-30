"use client";

import { useEffect } from "react";
import { updateLastModule } from "@/lib/progress";

export default function ModuleTracker({ slug }: { slug: string }) {
  useEffect(() => {
    updateLastModule(slug);
  }, [slug]);

  return null;
}

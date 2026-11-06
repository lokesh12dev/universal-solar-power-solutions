"use client";
import { useEffect } from "react";
import { track } from "@/lib/analytics";

/** Fires project_case_study_viewed once per detail-page mount. Event only — no PII. */
export function CaseStudyView() {
  useEffect(() => {
    track("project_case_study_viewed");
  }, []);
  return null;
}

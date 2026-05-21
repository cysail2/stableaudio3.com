import fs from "node:fs";
import path from "node:path";

export type PolicySlug = "privacy" | "terms" | "refund";

export function getPolicyMarkdown(slug: PolicySlug) {
  const policyPath = path.join(process.cwd(), "project", "policies", `${slug}.md`);
  return fs.readFileSync(policyPath, "utf8");
}

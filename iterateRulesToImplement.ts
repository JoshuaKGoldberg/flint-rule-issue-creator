import { comparisons } from "@flint.fyi/comparisons";
import type { Octokit } from "octokit";

import { getESLintRulesBySize } from "./getESLintRulesBySize.ts";

const toBeImplemented = new Map(
  comparisons
    .filter(
      (comparison) =>
        comparison.flint.plugin === "ts" &&
        comparison.flint.preset !== "Not implementing" &&
        !comparison.flint.implemented &&
        comparison.eslint?.length === 1
    )
    .map((comparison) => [comparison.eslint![0].name, comparison])
);

async function doesRuleHaveIssue(flintRuleName: string, octokit: Octokit) {
  const result = await octokit.request("GET /search/issues", {
    q: `in:title "Feature: Implement ${flintRuleName} rule (TypeScript)"`,
    type: "Issues",
    sort: "created",
    order: "desc",
  });

  return !!result.data.items.length;
}

export async function* iterateRulesToImplement(octokit: Octokit) {
  const eslintRulesBySize = await getESLintRulesBySize();

  for (const [eslintName] of eslintRulesBySize) {
    const comparison = toBeImplemented.get(eslintName);

    if (
      comparison &&
      !(await doesRuleHaveIssue(comparison.flint.name, octokit))
    ) {
      yield comparison;
    }
  }
}

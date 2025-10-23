import type { Octokit } from "octokit";

import { getESLintRulesBySize } from "./getESLintRulesBySize.ts";
import type { Strategy } from "./types.ts";
import { getESLintRulesInPlugin } from "./getESLintRulesInPlugin.ts";
import { styleText } from "node:util";

async function doesRuleHaveIssue(flintRuleName: string, octokit: Octokit) {
  const result = await octokit.request("GET /search/issues", {
    q: `in:title "Feature: Implement ${flintRuleName} rule (TypeScript)"`,
    type: "Issues",
    sort: "created",
    order: "desc",
  });

  return !!result.data.items.length;
}

export async function* iterateRulesToImplement(
  octokit: Octokit,
  strategy: Strategy
) {
  const candidates = await (strategy.kind === "by-size"
    ? getESLintRulesBySize()
    : getESLintRulesInPlugin(strategy));

  for (const candidate of candidates) {
    console.log(
      styleText(
        "gray",
        `Checking for existing issue on ${candidate.flint.name}...`
      )
    );
    if (await doesRuleHaveIssue(candidate.flint.name, octokit)) {
      console.log(
        styleText("gray", `${candidate.flint.name} issue already exists.`)
      );
    } else {
      console.log(styleText("gray", `Yielding ${candidate.flint.name}.`));
      yield candidate;
    }
  }
}

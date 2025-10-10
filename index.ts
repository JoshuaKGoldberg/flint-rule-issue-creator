import { octokitFromAuth } from "octokit-from-auth";

import { takeAsync } from "./takeAsync.ts";
import { iterateRulesToImplement } from "./iterateRulesToImplement.ts";
import { createIssueBody } from "./createIssueBody.ts";

const issuesToCreate = 10;

const octokit = await octokitFromAuth();
const rulesToImplement = await takeAsync(iterateRulesToImplement(octokit), issuesToCreate);

for (const rule of rulesToImplement) {
  await octokit.rest.issues.create({
    body: createIssueBody(rule),
    labels: ["plugin: typescript", "status: accepting prs", "type: feature"],
    milestone: 3,
    owner: "JoshuaKGoldberg",
    repo: "flint",
    title: `🚀 Feature: Implement ${rule.flint.name} rule (TypeScript)`,
  });
}

import { octokitFromAuth } from "octokit-from-auth";

import { takeAsync } from "./takeAsync.ts";
import { iterateRulesToImplement } from "./iterateRulesToImplement.ts";
import { createIssueBody } from "./createIssueBody.ts";
import type { Strategy } from "./types.ts";
import { styleText } from "node:util";

const goLive = !!process.env.GO_LIVE;

const issuesToCreate = 10;

const strategy = {
  kind: "in-plugin",
  plugin: "node",
} satisfies Strategy;

const octokit = await octokitFromAuth();

const rulesToImplement = await takeAsync(
  iterateRulesToImplement(octokit, strategy),
  issuesToCreate
);

for (const rule of rulesToImplement) {
  if (goLive) {
    console.log(styleText("gray", `Creating issue for ${rule.flint.name}...`));
    await octokit.rest.issues.create({
      body: createIssueBody(rule),
      labels: ["plugin: typescript", "status: accepting prs", "type: feature"],
      milestone: 3,
      owner: "JoshuaKGoldberg",
      repo: "flint",
      title: `🚀 Feature: Implement ${rule.flint.name} rule (TypeScript)`,
    });
    console.log(styleText("gray", "Created."));
  } else {
    console.log(rule);
  }
}

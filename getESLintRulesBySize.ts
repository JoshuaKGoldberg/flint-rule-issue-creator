import { execa } from "execa";

export async function getESLintRulesBySize() {
    const list = await execa("ls", ["-lS"], {
        cwd: "node_modules/eslint/lib/rules",
    });

    return (list.stdout as string)
        .split("\n")
        .map((line) => line.match(/staff\s+(\d+).+\s+([A-z-]+)\.js/))
        .filter((match) => match != null)
        .map((match) => [match[2], +match[1]] as const)
        .sort((a, b) => a[1] - b[1]);
}

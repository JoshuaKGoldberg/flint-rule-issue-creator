import { comparisons } from "@flint.fyi/comparisons";

export const toBeImplemented = new Map(
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

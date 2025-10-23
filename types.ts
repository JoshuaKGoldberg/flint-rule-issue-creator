export type Strategy = BySizeStrategy | InPluginStrategy;

export interface BySizeStrategy {
  kind: "by-size";
}

export interface InPluginStrategy {
  kind: "in-plugin";
  plugin: string;
}

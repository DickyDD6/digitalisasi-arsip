import { nextJsConfig } from "@repo/eslint-config/next-js";
import pluginQuery from "@tanstack/eslint-plugin-query";

export default [...nextJsConfig, ...pluginQuery.configs["flat/recommended"]];

import { config } from "@repo/eslint-config/base";
import pluginQuery from "@tanstack/eslint-plugin-query";

export default [
	...config,
	{
		...pluginQuery.configs["flat/recommended"],
	},
];

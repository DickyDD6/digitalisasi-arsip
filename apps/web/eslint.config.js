import { nextJsConfig } from "@repo/eslint-config/next-js";
import pluginQuery from "@tanstack/eslint-plugin-query";
import boundaries from "eslint-plugin-boundaries";

export default [
	...nextJsConfig,
	...pluginQuery.configs["flat/recommended"],
	{
		files: ["**/*.{ts,tsx}"],
		plugins: {
			boundaries,
		},
		settings: {
			"import/resolver": {
				typescript: {
					project: "./tsconfig.json",
				},
			},
			"boundaries/elements": [
				{
					type: "app",
					pattern: "app/**",
				},
				{
					type: "feature",
					pattern: "features/**",
				},
				{
					type: "widget",
					pattern: "features/**/widgets/**",
				},
				{
					type: "shared",
					pattern: "shared/**",
				},
			],
		},
		rules: {
			"boundaries/element-types": [
				"error",
				{
					default: "disallow",
					rules: [
						{
							from: "app",
							allow: ["feature", "shared"],
						},
						{
							from: "feature",
							allow: ["widget", "shared"],
							disallow: [["feature", { feature: "!${feature}" }]],
						},
						{
							from: "widget",
							allow: ["widget", "shared"],
							disallow: ["feature"],
						},
						{
							from: "shared",
							allow: ["shared"],
						},
					],
				},
			],
			"no-restricted-imports": [
				"error",
				{
					patterns: [
						{
							group: [
								"@/features/**/widgets/**/adapter",
								"@/features/**/widgets/**/mock",
								"@/features/**/widgets/**/config",
								"@/features/**/widgets/**/service",
								"@/features/**/widgets/**/types",
								"@/features/**/widgets/**/*.adapter",
								"@/features/**/widgets/**/*.mock",
								"@/features/**/widgets/**/*.config",
								"@/features/**/widgets/**/*.service",
								"@/features/**/widgets/**/*.types",
								"@/features/**/widgets/**/components/*.tsx",
								"@/features/**/widgets/adapter",
								"@/features/**/widgets/mock",
								"@/features/**/widgets/config",
								"@/features/**/widgets/service",
								"@/features/**/widgets/types",
								"@/features/**/widgets/*.adapter",
								"@/features/**/widgets/*.mock",
								"@/features/**/widgets/*.config",
								"@/features/**/widgets/*.service",
								"@/features/**/widgets/*.types",
								"@/features/**/widgets/components/*.tsx",
								"@/features/**/**/widgets/adapter",
								"@/features/**/**/widgets/mock",
								"@/features/**/**/widgets/config",
								"@/features/**/**/widgets/service",
								"@/features/**/**/widgets/types",
								"@/features/**/**/widgets/*.adapter",
								"@/features/**/**/widgets/*.mock",
								"@/features/**/**/widgets/*.config",
								"@/features/**/**/widgets/*.service",
								"@/features/**/**/widgets/*.types",
								"@/features/**/**/widgets/components/*.tsx",
							],
							message:
								"Widget internals (adapter/mock/config/service/types) are private. Import the widget public API instead.",
						},
					],
				},
			],
		},
	},
	{
		overrides: [
			{
				files: ["next.config.js"],
				env: { node: true },
			},
		],
	},
];

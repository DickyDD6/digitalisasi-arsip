import { defineConfig } from "vitest/config";
import { sharedConfig } from "@repo/vitest-config";

export default defineConfig({
  ...sharedConfig,
  test: {
    projects: [
      {
        root: "./apps/web",
        test: {
          ...sharedConfig.test,
        },
      },
      {
        root: "./packages/*",
        test: {
          ...sharedConfig.test,
        },
      },
    ],
  },
});

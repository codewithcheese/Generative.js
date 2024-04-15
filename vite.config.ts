import { defineConfig } from "vitest/config";
export default defineConfig({
  test: {
    globals: true,
    setupFiles: ["./setupTests.ts"],
    include: ["**/test/*.test.*"],
  },
});

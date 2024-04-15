import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  test: {
    globals: true,
    setupFiles: ["../../setupTests.ts"],
  },
  plugins: [react()],
});

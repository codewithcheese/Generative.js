import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
} from "@codesandbox/sandpack-react";
import { useTheme } from "nextra-theme-docs";

export function ExamplesLayout() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div className="flex h-full">
      <div className="w-[24ch]">
        <div className="flex-col m-2 space-y-2">
          <div className="flex border border-gray-100 dark:border-gray-800 p-4 hover:bg-gray-50 hover:dark:bg-gray-900">
            <h1>Chat MVP</h1>
          </div>
          <div className="flex border border-gray-200 p-4 hover:bg-gray-100 ">
            <h1>Infinite Autocomplete</h1>
          </div>
        </div>
      </div>
      <div className="flex-1 mt-2">
        <SandpackProvider theme={isDark ? "dark" : "light"} template="react-ts">
          <SandpackLayout className="h-full">
            <SandpackCodeEditor />
            <SandpackPreview />
          </SandpackLayout>
        </SandpackProvider>
      </div>
    </div>
  );
}

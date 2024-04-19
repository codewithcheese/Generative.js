import { useCallback, useEffect, useState } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFiles,
} from "@codesandbox/sandpack-react";
import { useTheme } from "nextra-theme-docs";
import examples from "../examples/index.json";

type ExampleEntry = {
  name: string;
  slug: string;
  files: string[];
};

export function ExamplesLayout() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [nonce, setNonce] = useState(0);
  const [files, setFiles] = useState<SandpackFiles>({});

  const switchExample = useCallback(async (example: ExampleEntry) => {
    const files: Record<string, string> = {};
    for (const fileName of example.files) {
      files[fileName] = (
        await import(`../examples/${example.slug}/${fileName}.sandpack`)
      ).default;
    }
    console.log("switch example", example, files);
    setFiles(files);
    setNonce(nonce + 1);
  }, []);

  useEffect(() => {
    if (examples.length > 0) {
      switchExample(examples[0]);
    }
  }, []);

  return (
    <div className="flex h-[calc(100vh-80px)]">
      <div className="w-[24ch]">
        <div className="flex-col m-2 space-y-2">
          {examples.map((example) => (
            <div
              onClick={() => switchExample(example)}
              className="flex font-mono border border-gray-100 dark:border-gray-800 p-4 hover:bg-gray-50 hover:dark:bg-gray-900"
            >
              <h1>{example.name}</h1>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 mt-2">
        <SandpackProvider
          key={nonce}
          files={files}
          customSetup={{
            dependencies: {
              "generative.js": "latest",
              "react-error-boundary": "^4.0.13",
            },
          }}
          theme={isDark ? "dark" : "light"}
          template="react-ts"
        >
          <SandpackLayout className="h-full">
            <SandpackCodeEditor showTabs={true} />
            <SandpackPreview />
          </SandpackLayout>
        </SandpackProvider>
      </div>
    </div>
  );
}

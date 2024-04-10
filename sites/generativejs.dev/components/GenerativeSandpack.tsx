import dynamic from "next/dynamic";
import { useTheme } from "nextra-theme-docs";
import multiline from "multiline-ts";

const Sandpack = dynamic(
  () => import("@codesandbox/sandpack-react").then((module) => module.Sandpack),
  { ssr: false },
);

export function GenerativeSandpack() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  return (
    <Sandpack
      theme={isDark ? "dark" : "light"}
      template="react-ts"
      options={{
        showTabs: true,
      }}
      customSetup={{
        dependencies: {
          "generative.js": "latest",
        },
      }}
      files={{
        "/App.tsx": multiline`
import {System, User, Assistant, GenerativeProvider} from "generative.js";

export default function App() {
  return (
    <GenerativeProvider>
      <System content="Greet the user">
        {(message) => message.content}
      </System>
    </GenerativeProvider>
  );
}`,
      }}
    />
  );
}

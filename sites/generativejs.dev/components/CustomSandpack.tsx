import dynamic from "next/dynamic";
const Sandpack = dynamic(
  () => import("@codesandbox/sandpack-react").then((module) => module.Sandpack),
  { ssr: false },
);

type CustomSandpackProps = {
  filename: string;
  children: string;
};
export function CustomSandpack(props: CustomSandpackProps) {
  const { children, filename } = props;
  return (
    <Sandpack
      template="react-ts"
      files={{
        [filename]: { code: children, active: true },
      }}
      options={{
        showLineNumbers: true,
        showInlineErrors: true,
        showTabs: false,
        closableTabs: false,
      }}
    />
  );
}

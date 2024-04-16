import { readTextContent, useMessage } from "../../src/index.js";

export function ShowMessage() {
  const { message } = useMessage();
  // wrap in div to be separate element that can be found using findByTest
  return <div>{message && readTextContent(message)}</div>;
}

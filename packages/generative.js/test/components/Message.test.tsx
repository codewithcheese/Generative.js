/* @vitest-environment jsdom */
import { test } from "vitest";
import {
  GenerativeProvider,
  Message,
  readTextContent,
  useMessage,
} from "../../src/index.js";
import { render } from "@testing-library/react";

test("should render message with render function", async () => {
  const { findByText } = render(
    <GenerativeProvider options={{ logLevel: "debug" }}>
      <Message type={{ role: "system", content: "A" }}>
        {readTextContent}
      </Message>
    </GenerativeProvider>,
  );
  await findByText("A");
});

test("should render message with message context", async () => {
  function MessageBubble() {
    const { message, complete } = useMessage();
    if (!message) {
      return "...";
    }
    return (
      <div>
        {readTextContent(message)}
        {complete ? "." : "#"}
      </div>
    );
  }
  const { findByText } = render(
    <GenerativeProvider options={{ logLevel: "debug" }}>
      <Message type={{ role: "system", content: "A" }}>
        <MessageBubble />
      </Message>
    </GenerativeProvider>,
  );
  await findByText("A.");
});

/* @vitest-environment jsdom */
import { assert, expect, test, vi } from "vitest";
import {
  AnthropicAssistant,
  createTool,
  GenerativeProvider,
  Message,
  System,
  User,
} from "../../src/index.js";
import { render } from "@testing-library/react";
import "dotenv/config";
import { z } from "zod";
import { ErrorBoundary } from "../util/ErrorBoundary.js";
import { getGenerative, UseGenerative } from "../util/UseGenerative.js";

test("should call anthropic model with messages", async () => {
  let done = false;
  const app = (
    <GenerativeProvider>
      <UseGenerative />
      <System content="Format your reply as JSON" />
      <User content="value = true" />
      <AnthropicAssistant requestOptions={{ max_tokens: 20 }}>
        <Message
          type={({ messages }) => {
            done = true;
            expect(messages).toHaveLength(3);
            expect(messages[0].role).toEqual("system");
            expect(messages[1].role).toEqual("user");
            expect(messages[2].role).toEqual("assistant");
          }}
          typeName="expect"
        >
          Done
        </Message>
      </AnthropicAssistant>
    </GenerativeProvider>
  );
  const { findByText } = render(app);
  await getGenerative()!.waitUntilSettled();
  await findByText("Done");
  expect(done).toEqual(true);
}, 10_000);

test("should use tool", async () => {
  const tool = createTool("result", z.object({ value: z.number() }));
  const app = (
    <GenerativeProvider>
      <UseGenerative />
      <User content="Use result tool. Calculate 1+1" />
      <AnthropicAssistant tools={[tool]} />
    </GenerativeProvider>
  );
  const {} = render(app);
  const generative = getGenerative();
  await generative!.waitUntilSettled();
  const messages = generative!.getAllMessages();
  expect(messages).toHaveLength(2);
  assert(messages[1].role === "assistant");
  expect(messages[1].tool_calls).toHaveLength(1);
});

test("should bubble error when apiKey invalid", async () => {
  vi.spyOn(console, "error").mockImplementation(() => {});
  try {
    const app = (
      <GenerativeProvider>
        <UseGenerative />
        <ErrorBoundary>
          <System content="The answer is 42. Be concise." />
          <User content="What is the answer?" />
          <AnthropicAssistant clientOptions={{ apiKey: "deadbeef" }} />
        </ErrorBoundary>
      </GenerativeProvider>
    );
    const { container } = render(app);
    const generative = getGenerative()!;
    await generative.waitUntilSettled();
    const errorDiv = container.querySelector("div");
    expect(errorDiv?.textContent).toContain("authentication_error");
  } finally {
    // @ts-expect-error TS not aware of mock
    console.error.mockRestore();
  }
}, 10_000);

test("should abort assistant response");

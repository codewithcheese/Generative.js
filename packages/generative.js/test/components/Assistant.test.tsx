/* @vitest-environment jsdom */
import { expect, test } from "vitest";
import {
  AnthropicAssistant,
  Assistant,
  OpenaiAssistant,
} from "../../src/index.js";
import "dotenv/config";

test("should return assistant based on api prop", async () => {
  const sharedProps = {
    content: "A",
  };
  const exclusiveOpenaiProps = {
    // todo
  };
  const exclusiveAnthropicProps = {
    // todo
  };
  let assistant;
  assistant = Assistant({
    ...sharedProps,
    ...exclusiveOpenaiProps,
  });
  // default to openai
  expect(assistant.type).toEqual(OpenaiAssistant);
  assistant = Assistant({
    api: "anthropic",
    ...sharedProps,
    ...exclusiveAnthropicProps,
  });
  expect(assistant.type).toEqual(AnthropicAssistant);
}, 10_000);

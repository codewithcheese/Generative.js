import "../util/readable-stream-polyfill.js";
import { AnthropicAssistant, AnthropicAssistantProps } from "../index.js";
import { OpenaiAssistant, OpenaiAssistantProps } from "./OpenaiAssistant.js";

export type AssistantApi = "openai" | "anthropic";

type AssistantProps<T extends "openai" | "anthropic"> = {
  api: T;
} & (T extends "openai" ? OpenaiAssistantProps : AnthropicAssistantProps);

export function Assistant<T extends "openai" | "anthropic">({
  api,
  ...props
}: AssistantProps<T>) {
  return api === "openai" ? (
    <OpenaiAssistant {...(props as OpenaiAssistantProps)} />
  ) : (
    <AnthropicAssistant {...(props as AnthropicAssistantProps)} />
  );
}

import "../util/readable-stream-polyfill.js";
import { AnthropicAssistant, AnthropicAssistantProps } from "../index.js";
import { OpenaiAssistant, OpenaiAssistantProps } from "./OpenaiAssistant.js";

export type AssistantApi = "openai" | "anthropic";

type AssistantProps<T extends "openai" | "anthropic"> = {
  api?: T;
} & (T extends "openai" ? OpenaiAssistantProps : AnthropicAssistantProps);

export function Assistant<T extends "openai" | "anthropic" = "openai">({
  api = "openai" as T,
  ...props
}: AssistantProps<T>) {
  switch (api) {
    case "openai":
      return <OpenaiAssistant {...(props as OpenaiAssistantProps)} />;
    case "anthropic":
      return <AnthropicAssistant {...(props as AnthropicAssistantProps)} />;
    default:
      throw Error(
        `Invalid value provided for the 'api' prop in the Assistant component. ` +
          `Expected one of "openai" or "anthropic", but received: "${api}". `,
      );
  }
}

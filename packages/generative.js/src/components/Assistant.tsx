import { AssistantMessage } from "../message.js";
import "../util/readable-stream-polyfill.js";
import { ReactNode } from "react";
import { MessageRenderFunc } from "./Message.js";
import { AnthropicAssistant, AnthropicAssistantProps, Tool } from "../index.js";
import { OpenaiAssistant, OpenaiAssistantProps } from "./OpenaiAssistant.js";

type optionsMap = {
  openai: {
    clientOptions: OpenaiAssistantProps["clientOptions"];
    requestOptions: OpenaiAssistantProps["requestOptions"];
  };
  anthropic: {
    clientOptions: AnthropicAssistantProps["clientOptions"];
    requestOptions: AnthropicAssistantProps["requestOptions"];
  };
};

export type AssistantApi = "openai" | "anthropic";

export function Assistant<T extends AssistantApi>({
  api,
  ...props
}: {
  api: T;
  content?: string; // set content to use Assistant as literal, no completion will be requested
  className?: string;
  model?: string;
  toolChoice?: "auto" | "none" | Tool<any>;
  tools?: Tool<any>[];
  requestOptions?: optionsMap[T]["requestOptions"];
  clientOptions?: optionsMap[T]["clientOptions"];
  children?: ReactNode | MessageRenderFunc<AssistantMessage>;
  onMessage?: (message: AssistantMessage) => void;
}) {
  return api === "openai" ? (
    <OpenaiAssistant {...(props as OpenaiAssistantProps)} />
  ) : (
    <AnthropicAssistant {...(props as AnthropicAssistantProps)} />
  );
}

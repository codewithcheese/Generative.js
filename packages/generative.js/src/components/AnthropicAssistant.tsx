import {
  AssistantMessage,
  type GenerativeMessage,
  MessageDelta,
} from "../message.js";
import Anthropic, {
  ClientOptions as AnthropicClientOptions,
} from "@anthropic-ai/sdk";
import "../util/readable-stream-polyfill.js";
import { ReactNode, useCallback } from "react";
import { ActionType } from "../action.js";
import { Message, MessageRenderFunc } from "./Message.js";
import { Tool } from "../index.js";
import {
  ImageBlockParam,
  MessageParam,
  TextBlockParam,
} from "@anthropic-ai/sdk/resources/index";

import { getLogger } from "../util/log.js";
import { zodToJsonSchema } from "zod-to-json-schema";
import { Stream } from "@anthropic-ai/sdk/streaming";
import {
  MessageCreateParamsNonStreaming,
  MessageCreateParamsStreaming,
} from "@anthropic-ai/sdk/resources/beta/tools/messages";

export type AnthropicAssistantProps = {
  content?: string; // set content to use Assistant as literal, no completion will be requested
  className?: string;
  model?: string;
  toolChoice?: "auto" | "none" | Tool<any>;
  tools?: Tool<any>[];
  requestOptions?: Partial<MessageCreateParamsStreaming>;
  clientOptions?: Partial<AnthropicClientOptions>;
  children?: ReactNode | MessageRenderFunc<AssistantMessage>;
  onMessage?: (message: AssistantMessage) => void;
};

export function AnthropicAssistant({
  content,
  className,
  model = "claude-3-haiku-20240307",
  toolChoice = "auto",
  tools = [],
  requestOptions = {},
  clientOptions = {},
  children,
  onMessage,
}: AnthropicAssistantProps) {
  const action = useCallback<ActionType>(
    async ({ messages, signal }) => {
      return fetchAnthropicCompletion({
        model,
        toolChoice,
        tools,
        messages,
        signal,
        requestOptions,
        clientOptions,
      });
    },
    [model, requestOptions, clientOptions, tools, toolChoice],
  );
  return (
    <Message<AssistantMessage>
      className={className}
      type={content ? { role: "assistant", content } : action}
      typeName="Assistant"
      onMessage={onMessage}
    >
      {children}
    </Message>
  );
}

async function fetchAnthropicCompletion({
  messages,
  model = "claude-3-haiku-20240307",
  toolChoice = "auto",
  tools = [],
  requestOptions = {},
  clientOptions = {},
}: {
  model: string;
  messages: GenerativeMessage[];
  toolChoice?: "auto" | "none" | Tool<any>;
  tools?: Tool<any>[];
  signal: AbortSignal;
  requestOptions?: Partial<MessageCreateParamsStreaming>;
  clientOptions?: AnthropicClientOptions;
}): Promise<ReadableStream<MessageDelta> | AssistantMessage> {
  if (toolChoice !== "auto") {
    getLogger("fetchAnthropicCompletion").warn(
      "Anthropic does not support tool select using toolChoice option. To enforce tool use include instruction in the messages.",
    );
  }
  if (tools.length) {
    clientOptions.defaultHeaders = {
      "anthropic-beta": "tools-2024-04-04",
    };
    requestOptions = {
      ...requestOptions,
      // @ts-expect-error JSONSchema types not exactly compatible
      tools: tools.map((tool) => {
        return {
          name: tool.name,
          description: tool.description,
          input_schema: zodToJsonSchema(tool.schema),
        };
      }),
    };
  }

  const anthropic = new Anthropic(clientOptions);
  const body: MessageCreateParamsStreaming | MessageCreateParamsNonStreaming = {
    model,
    max_tokens: 1024,
    system:
      messages.length && messages[0].role === "system"
        ? messages[0].content
        : undefined,
    messages: convertToAnthropicMessages(messages).filter(Boolean),
    stream: !tools.length,
    ...requestOptions,
  };
  const result = await anthropic.beta.tools.messages.create(body);
  if (result instanceof Stream) {
    return new ReadableStream<MessageDelta>({
      async start(controller) {
        // content blocks not yet supported for assistant responses
        for await (const chunk of result) {
          if (chunk.type === "message_start") {
            controller.enqueue({ role: chunk.message.role, content: "" });
          } else if (chunk.type === "content_block_start") {
            if (chunk.content_block.type !== "text") {
              throw Error(
                `Unsupported assistant response. Support for Anthropic non-text content blocks not implemented. ${JSON.stringify(
                  chunk,
                )}`,
              );
            }
            controller.enqueue({ content: chunk.content_block.text });
          } else if (chunk.type === "content_block_delta") {
            controller.enqueue({ content: chunk.delta.text });
          }
        }
        controller.close();
      },
    });
  } else {
    const message: AssistantMessage = { role: result.role, content: null };
    for (const block of result.content) {
      if (block.type === "text") {
        message.content == null
          ? (message.content = "")
          : // add new line for each block
            (message.content += "\n");
        message.content += block.text;
      } else if (block.type === "tool_use") {
        if (!message.tool_calls) {
          message.tool_calls = [];
        }
        message.tool_calls.push({
          id: block.id,
          type: "function",
          function: {
            name: block.name,
            arguments: JSON.stringify(block.input),
          },
        });
      }
    }
    return message;
  }
}

function convertToAnthropicMessages(
  messages: GenerativeMessage[],
): MessageParam[] {
  const logger = getLogger("convertToAnthropicMessages");
  const converted = messages.map((message, index): MessageParam | null => {
    if (message.role === "system") {
      // anthropic does not support inline system messages
      // convert to user message with <System> tag, need to test if this has any effect
      if (index !== 0) {
        return { role: "user", content: `<System>${message.content}</System>` };
      } else {
        return null;
      }
    } else if (message.role === "tool") {
      return {
        role: "user",
        content: [
          {
            type: "tool_result",
            tool_use_id: message.tool_call_id,
            content: message.content,
          } as any, // no types of this user content as of 0.20.4
        ],
      };
    } else if (message.role === "user") {
      if (Array.isArray(message.content)) {
        let content: (TextBlockParam | ImageBlockParam)[] = [];
        // anthropic does not support type: image_url, excluded from content.
        // supply both type: base64 and type: image_url for cross compatible images
        message.content.forEach((m) => {
          if (m.type === "text") {
            content.push(m);
          } else {
            logger.warn(
              `Excluded ${
                m.type
              } content from assistant message: ${JSON.stringify(message)}`,
            );
          }
        });
        return {
          role: "user",
          content,
        };
      } else {
        return {
          role: "user",
          content: message.content,
        };
      }
    } else {
      if (message.content == null) {
        throw Error(
          `Invalid assistant message. Anthropic does not support null content. ${JSON.stringify(
            message,
          )}`,
        );
      }
      return message as { role: "assistant"; content: string };
    }
  });
  // filter out nulls
  return converted.filter(Boolean) as MessageParam[];
}

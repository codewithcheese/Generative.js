"use client";
import { useContext } from "react";
import { MessageContext } from "../components/index.js";
import { GenerativeMessage } from "../message.js";

export function useMessage<MessageType extends GenerativeMessage>() {
  const context = useContext(MessageContext) as {
    message: MessageType | null;
    complete: boolean;
  };
  if (context == null) {
    throw Error(
      "Cannot access message. Usage of useMessage() must be wrapped by a message provider. e.g. System, User, Assistant",
    );
  }
  return context;
}

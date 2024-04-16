import { ReactNode, useMemo } from "react";
import { UserMessage } from "../message.js";
import { Message } from "./Message.js";

export function User({
  content,
  children,
  onMessage,
}: {
  content?: UserMessage["content"];
  children?: ReactNode | ((message: UserMessage) => ReactNode);
  onMessage?: (message: UserMessage) => void;
}) {
  const type = useMemo(
    () => (content ? { role: "user" as const, content } : "LISTENER"),
    [content],
  );
  const deps = useMemo(() => [content], [content]);
  return (
    <Message<UserMessage>
      type={type}
      typeName="User"
      deps={deps}
      onMessage={onMessage}
    >
      {children}
    </Message>
  );
}

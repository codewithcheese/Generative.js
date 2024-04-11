import { ReactNode, useMemo } from "react";
import { UserMessage } from "../message.js";
import { Message } from "./Message.js";

export function User({
  content,
  children,
  className,
  onMessage,
}: {
  content?: UserMessage["content"];
  children?: ReactNode | ((message: UserMessage) => ReactNode);
  className?: string;
  onMessage?: (message: UserMessage) => void;
}) {
  const type = useMemo(
    () => (content ? { role: "user" as const, content } : "LISTENER"),
    [content],
  );
  const deps = useMemo(() => [content], [content]);
  return (
    <Message<UserMessage>
      className={className}
      type={type}
      typeName="User"
      deps={deps}
      onMessage={onMessage}
    >
      {children}
    </Message>
  );
}

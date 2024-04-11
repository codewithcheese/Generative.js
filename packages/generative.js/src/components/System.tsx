import { Message } from "./Message.js";
import { ReactNode, useMemo } from "react";
import { SystemMessage } from "../message.js";

export function System({
  content,
  children,
  className,
  onMessage,
}: {
  content: string;
  children?: ReactNode | ((message: SystemMessage) => ReactNode);
  className?: string;
  onMessage?: (message: SystemMessage) => void;
}) {
  const message = useMemo(
    (): SystemMessage => ({ role: "system", content }),
    [content],
  );
  const deps = useMemo(() => [content], [content]);
  return (
    <Message<SystemMessage>
      type={message}
      typeName="System"
      deps={deps}
      className={className}
      onMessage={onMessage}
    >
      {children}
    </Message>
  );
}

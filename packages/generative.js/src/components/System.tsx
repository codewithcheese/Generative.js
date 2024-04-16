import { Message } from "./Message.js";
import { ReactNode, useMemo } from "react";
import { SystemMessage } from "../message.js";

export function System({
  content,
  children,
  onMessage,
}: {
  content: string;
  children?: ReactNode | ((message: SystemMessage) => ReactNode);
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
      onMessage={onMessage}
    >
      {children}
    </Message>
  );
}

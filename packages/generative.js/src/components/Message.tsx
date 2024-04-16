import { createContext, DependencyList, FC, ReactNode } from "react";
import { ParentContext, useGenerative } from "../hooks/index.js";
import { GenerativeElement, GenerativeMessage } from "../index.js";

export const MessageContext = createContext<{
  message: GenerativeMessage | null;
  complete: boolean;
}>(null!);

export type MessageRenderFunc<MessageType extends GenerativeMessage> = (
  message: MessageType,
  complete: boolean,
) => ReactNode;

export function Message<MessageType extends GenerativeMessage>({
  type,
  typeName,
  className,
  children,
  deps = [],
  onMessage,
}: {
  className?: string;
  type: GenerativeElement["type"];
  typeName?: string;
  children?: ReactNode | MessageRenderFunc<MessageType>;
  deps?: DependencyList;
  onMessage?: (message: MessageType) => void;
}) {
  const { id, ref, message, ready, complete } = useGenerative<MessageType>({
    type,
    typeName,
    deps,
    onMessage,
  });

  return (
    <>
      <span data-generative-id={id} ref={ref} className={className}></span>
      <ParentContext.Provider value={{ id }}>
        {ready && (
          <MessageContext.Provider value={{ message, complete }}>
            {typeof children === "function"
              ? children(message!, complete)
              : children}
          </MessageContext.Provider>
        )}
      </ParentContext.Provider>
    </>
  );
}

/**
 * Wraps a component with a Message component with a NOOP action.
 * For when the component should render in turn.
 */
export function waitTurn<Props extends {}>(Component: FC<Props>) {
  return function (props: Props) {
    return (
      <Message type="NOOP">
        <Component {...props} />
      </Message>
    );
  };
}

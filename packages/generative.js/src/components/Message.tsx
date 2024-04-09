import { DependencyList, FC, ReactNode } from "react";
import { useGenerative } from "../hooks/index.js";
import { GenerativeElement, GenerativeMessage } from "../index.js";

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
  onBeforeResolved,
  onBeforeFinalized,
}: {
  className?: string;
  type: GenerativeElement["type"];
  typeName?: string;
  children?: ReactNode | MessageRenderFunc<MessageType>;
  deps?: DependencyList;
  onBeforeResolved?: (message: MessageType) => void;
  onBeforeFinalized?: (message: MessageType) => void;
}) {
  const { id, ref, message, ready, complete } = useGenerative<MessageType>({
    type,
    typeName,
    deps,
    onBeforeResolved,
    onBeforeFinalized,
  });

  // const renderCount = useRef(0);
  // useEffect(() => {
  //   renderCount.current++;
  // });
  // console.log(
  //   `Generative id=${id} isPending=${isPending} renderCount=${renderCount.current}`,
  // );

  return (
    <div data-generative-id={id} ref={ref} className={className}>
      {ready &&
        (typeof children === "function"
          ? children(message!, complete)
          : children)}
    </div>
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

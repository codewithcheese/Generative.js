import { ReactNode } from "react";
import { getLogger } from "../util/log.js";
import { GenerativeMessage } from "../message.js";
import {
  ParentContext,
  useAfterChildren,
  useGenerative,
} from "../hooks/index.js";

type FallbackProps = {
  handler: (message: GenerativeMessage) => void;
  className?: string;
  children?: ReactNode;
};

/**
 *	Repeat the children indefinitely or until stopped or limit is reached if set.
 */
export function Fallback({ handler, className, children }: FallbackProps) {
  const logger = getLogger("Fallback");
  const { ref, id, parentId, element, ready } = useGenerative({
    type: "NOOP",
    typeName: "Fallback",
  });
  useAfterChildren(element, (messages) => {
    logger.debug("calling fallback handler");
    handler(messages[messages.length - 1]!);
  });
  return (
    <div
      data-generative-id={id}
      data-generative-parent-id={parentId}
      ref={ref}
      className={className}
    >
      <ParentContext.Provider value={{ id }}>
        {ready && children}
      </ParentContext.Provider>
    </div>
  );
}

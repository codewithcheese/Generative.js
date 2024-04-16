import { Fragment, ReactNode, useCallback, useState } from "react";
import { getLogger } from "../util/log.js";
import { Message } from "./Message.js";

type RepeatProps = {
  limit?: number;
  stopped?: boolean;
  children?: ReactNode;
};

/**
 *	Repeat the children indefinitely or until stopped or limit is reached if set.
 */
export function Repeat({ limit, stopped = false, children }: RepeatProps) {
  const logger = getLogger("Repeat");
  const [iteration, setIteration] = useState(1);
  const afterChildren = useCallback(() => {
    if (stopped) {
      return;
    }
    setIteration((i) => {
      if (!limit) {
        return i + 1;
      }
      if (i < limit) {
        logger.debug(`before=${i} after=${i + 1} limit=${limit}`);
        return i + 1;
      } else {
        logger.debug(`i=${i} limit=${limit}`);
        return i;
      }
    });
  }, [stopped]);

  return (
    <Message type="NOOP" typeName="Repeat" onAfterChildren={afterChildren}>
      {Array(iteration)
        .fill(true)
        .map((_, index) => {
          logger.debug(`JSX iteration=${index}`);
          return (
            <Fragment key={index}>
              {children}
              {/*{Children.map(children, (child) => cloneElement(child))}*/}
            </Fragment>
          );
        })}
    </Message>
  );
}

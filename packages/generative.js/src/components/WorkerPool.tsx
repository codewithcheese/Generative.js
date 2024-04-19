"use client";
import { Message, waitTurn } from "./Message.js";
import { Worker } from "../worker.js";
import { ReactNode, useEffect, useMemo } from "react";
import { withResolvers } from "../util/with-resolvers.js";

export const WorkerPool = waitTurn(function WorkerPool({
  workers,
  children,
  onFinished,
}: {
  workers: Worker[];
  children: ReactNode;
  onFinished?: () => void;
}) {
  // resolve when all workers complete
  const { resolve, promise } = useMemo(() => withResolvers<void>(), []);
  useEffect(() => {
    if (workers.every((worker) => worker.finished)) {
      onFinished && onFinished();
      resolve();
    }
  });

  return (
    <>
      {workers.map((worker) => worker.portal)}
      {/* use promise action to wait for all workers */}
      <Message type={() => promise}>{children}</Message>
    </>
  );
});

"use client";
import {
  ReactNode,
  ReactPortal,
  useCallback,
  useId,
  useMemo,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { GenerativeProvider } from "./components/index.js";
import { GenerativeMessage } from "./message.js";

export type Worker = {
  portal: ReactPortal;
  finished: boolean;
  messages: GenerativeMessage[] | null;
};

/**
 * Uses React Portal to create independent instances of Generative.
 * onFinished callback to receives messages instance has finished.
 * Check worker.test.tsx for usage.
 *
 * @returns [worker, finished] - worker is the React Portal instance, finished is a boolean indicating if the worker has finished.
 */
export function createWorker(
  children: ReactNode,
  key: string,
  options: {
    container?: HTMLElement;
  } = {},
): Worker {
  const id = useId();
  const [finished, setFinished] = useState(false);
  const [messages, setMessages] = useState<GenerativeMessage[] | null>([]);
  const finishHandler = useCallback((messages: GenerativeMessage[]) => {
    setMessages(messages);
    setFinished(true);
  }, []);
  const portal = useMemo(() => {
    const container = options.container || document.createElement("div");
    container.setAttribute("data-generative-worker-id", id);
    document.body.appendChild(container);
    return createPortal(
      <GenerativeProvider handlers={{ onFinished: finishHandler }}>
        {children}
      </GenerativeProvider>,
      container,
      key,
    );
  }, [key]);

  return { portal, finished, messages };
}

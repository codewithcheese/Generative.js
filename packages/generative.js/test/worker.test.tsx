/* @vitest-environment jsdom */
import { expect, test } from "vitest";
import {
  createWorker,
  GenerativeProvider,
  Message,
  readTextContent,
  System,
  WorkerPool,
} from "../src/index.js";
import { render } from "@testing-library/react";
import { getGenerative, UseGenerative } from "./util/UseGenerative.js";
import { sleep } from "../src/util/sleep.js";
import { useState } from "react";
import { useRenderCount } from "./util/render-count-hook.js";
import { ShowMessage } from "./util/show-message.js";

test("should use 3 works concurrently and display `Done` when all finished", async () => {
  const workerApp = (system: string, completion: string) => (
    <>
      <System content={system}>
        <ShowMessage />
      </System>
      <Message
        type={async () => {
          await sleep(500);
          return { role: "assistant", content: completion };
        }}
      >
        <ShowMessage />
      </Message>
    </>
  );

  function Concurrently() {
    const [notify, setNotify] = useState("Waiting.");
    const renderCount = useRenderCount();
    const workers = [
      createWorker(workerApp("A", "B"), "1"),
      createWorker(workerApp("C", "D"), "2"),
      createWorker(workerApp("E", "F"), "3"),
    ];
    function onFinished() {
      setNotify("Done.");
    }
    console.log(
      "Concurrently",
      "renderCount",
      renderCount,
      "finished",
      workers.map((worker) => [worker.finished, worker.messages]),
      "notify",
      notify,
    );

    return (
      <WorkerPool workers={workers} onFinished={onFinished}>
        {notify}
      </WorkerPool>
    );
  }

  const app = (
    <GenerativeProvider>
      <UseGenerative />
      <Concurrently />
    </GenerativeProvider>
  );
  const { findByText } = render(app);
  const generative = getGenerative()!;
  await generative.waitUntilSettled();
  await Promise.race([findByText("Waiting."), findByText("Done.")]);
  expect(document.body.textContent).toEqual("Done.ABCDEF");
});

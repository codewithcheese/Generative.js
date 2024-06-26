/* @vitest-environment jsdom */
import { expect, test } from "vitest";
import {
  Append,
  Decision,
  GenerativeProvider,
  Goto,
  Message,
  readTextContent,
  Router,
  Routes,
  System,
  useRouteData,
} from "../../src/index.js";
import { render } from "@testing-library/react";
import { getGenerative, UseGenerative } from "../util/UseGenerative.js";
import { sleep } from "../../src/util/sleep.js";
import { ShowMessage } from "../util/show-message.js";

test("should display / then goto /second", async () => {
  function First() {
    return (
      <>
        <System content="A">{readTextContent}</System>
        <Message
          type={() => {
            // wait for async action before Goto
            sleep(100);
          }}
        >
          <Goto path="/second" data="B" />
        </Message>
      </>
    );
  }
  function Second() {
    const data = useRouteData();
    return <System content={data}>{readTextContent}</System>;
  }
  const routes: Routes = [
    { path: "/", component: <First /> },
    { path: "/second", component: <Second /> },
  ];
  const { findByText, container } = render(
    <GenerativeProvider>
      <UseGenerative />
      <Router routes={routes} />
    </GenerativeProvider>,
  );
  await findByText("A");
  await findByText("B");
  // only B should be visible
  const elements = container.querySelectorAll("[data-generative-id]");
  expect(elements).toHaveLength(1);
});

test("should display / then append /second", async () => {
  function First() {
    return (
      <>
        <System content="A">
          <ShowMessage />
        </System>
        <Message
          type={() => {
            // wait for async action before Goto
            sleep(100);
          }}
        >
          <Append path="/second" data="B" />
        </Message>
      </>
    );
  }
  function Second() {
    const data = useRouteData();
    return (
      <System content={data}>
        <ShowMessage />
      </System>
    );
  }
  const routes: Routes = [
    { path: "/", component: <First /> },
    { path: "/second", component: <Second /> },
  ];
  const { findByText, container } = render(
    <GenerativeProvider>
      <UseGenerative />
      <Router routes={routes} />
    </GenerativeProvider>,
  );
  await findByText("A");
  await findByText("B");
  // both A and B should be visible
  console.log(container.innerHTML);
  const elements = container.querySelectorAll("[data-generative-id]");
  expect(elements).toHaveLength(3); // 3 including async Message
});

test("should display / and then use Decision to append /second", async () => {
  function First() {
    return (
      <>
        <System content="A">
          <ShowMessage />
        </System>
        <Message
          type={() => {
            // wait for async action before Goto
            sleep(100);
          }}
        >
          <Decision
            api="openai"
            instruction="Select /second"
            operation="append"
          />
        </Message>
      </>
    );
  }
  function Second() {
    return (
      <System content={"B"}>
        <ShowMessage />
      </System>
    );
  }
  const routes: Routes = [
    { path: "/", component: <First /> },
    { path: "/second", component: <Second /> },
  ];
  const { findByText } = render(
    <GenerativeProvider>
      <UseGenerative />
      <Router routes={routes} />
    </GenerativeProvider>,
  );
  const generative = getGenerative()!;
  await generative.waitUntilSettled();
  await findByText("A");
  await findByText("B");
});

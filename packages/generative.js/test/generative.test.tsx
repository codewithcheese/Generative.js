/* @vitest-environment jsdom */
import { test } from "vitest";
import { GenerativeProvider, System, User } from "../src/index.js";
import { getGenerative, UseGenerative } from "./util/UseGenerative.js";
import { render } from "@testing-library/react";
import { ShowMessage } from "./util/show-message.js";

test("should wait for input before generative is finished", async () => {
  const app = (
    <GenerativeProvider options={{ logLevel: "debug" }}>
      <UseGenerative />
      <User />
    </GenerativeProvider>
  );
  const {} = render(app);
  const generative = getGenerative()!;
  await generative.waitUntilListening();
  generative.submit({
    role: "user",
    content: [{ type: "text", text: "A" }],
  });
  await generative.waitUntilFinished();
});

test("should support multiple providers in a single render", async () => {
  const app = (
    <>
      <GenerativeProvider options={{ logLevel: "debug" }}>
        <System content="A">
          <ShowMessage />
        </System>
      </GenerativeProvider>
      <GenerativeProvider options={{ logLevel: "debug" }}>
        <System content="B">
          <ShowMessage />
        </System>
      </GenerativeProvider>
    </>
  );
  const { findByText } = render(app);
  await findByText("A");
  await findByText("B");
});

test("should support nested providers in a single render", async () => {
  const app = (
    <>
      <GenerativeProvider options={{ logLevel: "debug" }}>
        <System content="A">
          <ShowMessage />
        </System>
        <GenerativeProvider options={{ logLevel: "debug" }}>
          <System content="B">
            <ShowMessage />
          </System>
        </GenerativeProvider>
      </GenerativeProvider>
    </>
  );
  const { findByText } = render(app);
  await findByText("A");
  await findByText("B");
});

test("should wait for multiple inputs", async () => {
  const app = (
    <GenerativeProvider options={{ logLevel: "debug" }}>
      <UseGenerative />
      <User />
      <User />
      <User />
    </GenerativeProvider>
  );
  const {} = render(app);
  const generative = getGenerative()!;
  await generative.waitUntilListening();
  generative.submit({
    role: "user",
    content: [{ type: "text", text: "A" }],
  });
  await generative.waitUntilListening();
  generative.submit({
    role: "user",
    content: [{ type: "text", text: "B" }],
  });
  await generative.waitUntilListening();
  generative.submit({
    role: "user",
    content: [{ type: "text", text: "C" }],
  });
  await generative.waitUntilFinished();
});

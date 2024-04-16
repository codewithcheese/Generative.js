import { FormEvent, ReactNode, useState } from "react";
import {
  Assistant,
  GenerativeProvider,
  readTextContent,
  useMessage,
  User,
} from "generative.js";
import { ErrorBoundary } from "react-error-boundary";

function Chat() {
  const [elements, setElements] = useState<ReactNode[]>([]);

  function submitMessage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const text = data.get("text") as string;
    setElements((e) => {
      return e.concat([
        <User content={text}>
          <MessageBubble />
        </User>,
        <Assistant api="openai">
          <MessageBubble />
        </Assistant>,
      ]);
    });
  }

  return (
    <>
      <div>{elements}</div>
      <form onSubmit={submitMessage}>
        <input name="text" type="text" />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}

function MessageBubble() {
  const { message } = useMessage();
  return <div>{message && readTextContent(message)}</div>;
}

export default function App() {
  return (
    <ErrorBoundary
      fallbackRender={(props) =>
        props.error?.message || "Unknown error. Check the console."
      }
    >
      <GenerativeProvider>
        <Chat />
      </GenerativeProvider>
    </ErrorBoundary>
  );
}

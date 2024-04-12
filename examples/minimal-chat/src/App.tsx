import { FormEvent, ReactNode, useState } from "react";
import {
  Assistant,
  GenerativeProvider,
  readTextContent,
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
        <User content={text}>{(message) => readTextContent(message)}</User>,
        <Assistant>{(message) => message.content}</Assistant>,
      ]);
    });
    return false;
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

function App() {
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

export default App;

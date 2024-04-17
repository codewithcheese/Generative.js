import { useState } from "react";
import {
  Assistant,
  AssistantMessage,
  GenerativeProvider,
  System,
  useMessage,
  User,
} from "generative.js";
import { ErrorBoundary } from "react-error-boundary";

export default function App() {
  const [value, setValue] = useState("");
  return (
    <ErrorBoundary
      fallbackRender={(props) => props.error?.message || "Unknown error. Check the console."}
    >
      <label htmlFor="ice-cream-choice">Favorite ice cream flavor: </label>
      <input
        list="ice-cream-flavors"
        id="ice-cream-choice"
        placeholder="Enter flavor"
        onChange={(e) => setValue(e.target.value)}
      />
      <AutoComplete id="ice-cream-flavors" value={value} item="ice cream flavor" />
    </ErrorBoundary>
  );
}

function AutoComplete({ id, value, item }: { id: string; value: string; item: string }) {
  const system = `
    Reply with JSON. 
    JSONSchema: { suggestions: { type: 'array', items: { type: 'string' } } }
`.trim();
  return (
    <>
      <GenerativeProvider>
        <datalist id={id}>
          {value !== "" && (
            <>
              <System content={system}></System>
              <User content={`Suggest ice cream flavors starting "${value}"`} />
              <Assistant
                api="openai"
                content={`Here are 5 ${item} suggestions that start with "${value}":"`}
              />
              <Assistant
                key={value}
                api="openai"
                requestOptions={{ response_format: { type: "json_object" } }}
              >
                <Options />
              </Assistant>
            </>
          )}
        </datalist>
      </GenerativeProvider>
    </>
  );
}

function Options() {
  const { message, complete } = useMessage<AssistantMessage>();
  // todo partial parsing of streaming message
  if (!complete || !message || !message.content) {
    return null;
  }
  // todo validate response
  const response = JSON.parse(message.content);
  return response.suggestions.map((s: string, index: number) => (
    <option key={index} value={s}></option>
  ));
}

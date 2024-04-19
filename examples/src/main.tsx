import "./main.css";
import * as React from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
  Outlet,
} from "react-router-dom";
import examples from "./index.json";

if ("VITE_OPENAI_API_KEY" in import.meta.env) {
  // @ts-ignore
  globalThis.process = {
    env: { OPENAI_API_KEY: import.meta.env["VITE_OPENAI_API_KEY"] },
  };
}

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div className="flex h-screen">
        <div className="w-64 bg-gray-100 overflow-y-auto">
          <nav className="p-4">
            <ul>
              {examples.map((example) => (
                <li className="mb-4 font-mono">
                  <Link to={`/${example.slug}`}>{example.name}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </div>
      </div>
    ),
    children: await Promise.all(
      examples.map(async (example) => {
        const App = (await import(`./${example.slug}/App.tsx`)).default;
        return {
          path: example.slug,
          element: <App />,
        };
      }),
    ),
  },
]);

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);
  root.render(<RouterProvider router={router} />);
}

import { useContext } from "react";
import { MessageContext } from "../components/index.js";

export function useMessage() {
  const context = useContext(MessageContext);
  if (context == null) {
    throw Error(
      "Cannot access message. Usage of useMessage() must be wrapped by a message provider. e.g. System, User, Assistant",
    );
  }
  return context;
}

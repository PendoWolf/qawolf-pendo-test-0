import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const VISITOR_KEY = 'qawolf_demo_visitor_id';
const visitorId = localStorage.getItem(VISITOR_KEY) ?? (() => {
  const id = crypto.randomUUID();
  localStorage.setItem(VISITOR_KEY, id);
  return id;
})();

pendo.initialize({
  visitor: {
    id: visitorId
  },
  account: {
    id: 'qawolf-demo'
  }
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

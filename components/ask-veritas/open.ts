// Open Ask Veritas from anywhere: the footer triangle panel, a nav link, a CTA.
//   import { openAskVeritas } from "@/components/open";
//   <button onClick={() => openAskVeritas("truth")}>Take the Truth Test</button>
//   <button onClick={() => openAskVeritas("ask", "What was the truth behind Windhoek?")}>…</button>
// Passing a question opens the Ask tab and sends it straight away.

export type AskMode = "ask" | "truth" | "process";
export const OPEN_EVENT = "ask-veritas:open";

export function openAskVeritas(mode: AskMode = "ask", question?: string): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: { mode, question } }));
}

// The nav bar's triangle toggles the panel; the panel reports open/closed so the
// triangle can show it (it points down while the panel is open).
export const TOGGLE_EVENT = "ask-veritas:toggle";
export const STATE_EVENT = "ask-veritas:state";

export function toggleAskVeritas(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(TOGGLE_EVENT));
}

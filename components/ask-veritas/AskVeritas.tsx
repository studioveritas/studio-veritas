"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { askPromptsFor, getCaseStudy } from "@/components/work-data";
import { getArticle, askPromptsForArticle, NEWS_PROMPTS } from "@/components/news-data";
import { PROCESS, processReady } from "@/lib/ask-veritas/process";
import { parseVerdict, type Verdict } from "@/lib/ask-veritas/truth";
import { OPEN_EVENT, TOGGLE_EVENT, STATE_EVENT, type AskMode } from "./open";
import "./ask-veritas.css";

type Msg = { id: number; role: "user" | "assistant"; text: string; local?: boolean; type?: boolean };
type TruthResult = { id: number; claim: string; raw: string; verdict: Verdict | null };

const MAX_CHARS = 400;
const SESSION_CAP = 10; // model calls per page visit, shared by Ask and the Truth Test. The server enforces the real limits.
const EMAIL = "info@studio-veritas.com";

// Shown at first interaction, before any API call (EU AI Act Art. 50: tell people it's AI).
const DISCLOSURE = `I'm Veritas, an AI assistant for Studio Veritas, not a person. I only know what's on this site and in the studio's credentials. Ask me anything about the work or the thinking. For anything that matters, email ${EMAIL}.`;

const TRUTH_INTRO =
  "The Truth Test. Paste a tagline, a promise or a line your brand uses. Veritas, an AI, reads it through three lenses: Truthful, Noticeable, Memorable. Candid, not cruel. It judges the words, not the company.";

const SUGGESTIONS = [
  "What does Veritas actually do?",
  "Brands or agencies: who do you work with?",
  "Show me work like Allbirds or Puma",
];

/* ---------- typewriter ---------- */

function Typed({ text, onTick, onDone }: { text: string; onTick?: () => void; onDone?: () => void }) {
  const [n, setN] = useState(0);
  const cbs = useRef({ onTick, onDone });
  const fired = useRef(false);
  useEffect(() => {
    cbs.current = { onTick, onDone };
  });
  useEffect(() => {
    if (n >= text.length) {
      if (!fired.current) {
        fired.current = true;
        cbs.current.onDone?.();
      }
      return;
    }
    const t = setTimeout(() => {
      setN((v) => Math.min(text.length, v + 2));
      cbs.current.onTick?.();
    }, 16);
    return () => clearTimeout(t);
  }, [n, text]);
  return (
    <span onClick={() => setN(text.length)}>
      {text.slice(0, n)}
      {n < text.length && <span className="av-caret" aria-hidden="true" />}
    </span>
  );
}

/* ---------- Truth Test verdict: each line types in turn ---------- */

function VerdictCard({ v, animate, onTick }: { v: Verdict; animate: boolean; onTick: () => void }) {
  const total = 1 + v.marks.length + (v.sharper ? 1 : 0);
  const [step, setStep] = useState(animate ? 0 : total);
  const next = useCallback(() => setStep((s) => s + 1), []);
  const show = (i: number, text: string): ReactNode =>
    i < step ? text : i === step ? <Typed text={text} onTick={onTick} onDone={next} /> : null;

  return (
    <div className="av-card">
      <p className="av-v">{show(0, v.verdict)}</p>
      {v.marks.map((m, i) =>
        step >= i + 1 ? (
          <div className="av-mark" key={m.name}>
            <div className="av-mark-head">
              <span className="av-mark-name">{m.name}</span>
              <span className={`av-rate av-rate-${m.rating.toLowerCase()}`}>{m.rating}</span>
            </div>
            <p>{show(i + 1, m.note)}</p>
          </div>
        ) : null
      )}
      {v.sharper && step >= total - 1 ? (
        <div className="av-mark av-sharper">
          <div className="av-mark-head">
            <span className="av-mark-name">Sharper</span>
          </div>
          <p>{show(total - 1, v.sharper)}</p>
        </div>
      ) : null}
      {step >= total && (
        <p className="av-cta">
          A verdict is a start, not a strategy. For the real conversation: <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </p>
      )}
    </div>
  );
}

/* ---------- the panel ---------- */

export default function AskVeritas({
  trigger,
  showTrigger = false,
  side = "right",
}: {
  /**
   * What opens the panel:
   *  "triangle" - outline triangle, fixed in the bottom corner given by `side` (left or right) or bottom centre
   *  "pill"     - floating "Ask Veritas" pill
   *  "none"     - nothing; open it with openAskVeritas() from your own button (default)
   */
  trigger?: "triangle" | "pill" | "none";
  /** @deprecated use trigger="pill" */
  showTrigger?: boolean;
  /** Where the triangle sits and the panel opens: "top" opens under the nav bar's triangle (the site default, with trigger="none"). */
  side?: "left" | "right" | "center" | "top";
}) {
  const triggerKind = trigger ?? (showTrigger ? "pill" : "none");
  const reduce = useReducedMotion() ?? false;
  const guide = processReady();
  const modes: { key: AskMode; label: string }[] = [
    { key: "ask", label: "Ask" },
    { key: "truth", label: "Truth Test" },
    ...(guide ? [{ key: "process" as AskMode, label: "Process" }] : []),
  ];

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<AskMode>("ask");
  const [msgs, setMsgs] = useState<Msg[]>([{ id: 0, role: "assistant", text: DISCLOSURE, local: true }]);
  const [input, setInput] = useState("");
  const [claim, setClaim] = useState("");
  const [truth, setTruth] = useState<TruthResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [calls, setCalls] = useState(0);
  const [stage, setStage] = useState(0);
  const [pending, setPending] = useState<string | null>(null);

  // On a case study or article page, suggest questions about it: a nudge under the
  // nav triangle a moment after the page opens, and the first chips in the panel.
  // On /news, the chips lead with a question about the studio's point of view.
  const pathname = usePathname() || "";
  const caseWork = getCaseStudy(pathname.match(/^\/experience\/([^/]+)\/?$/)?.[1] ?? "");
  const article = getArticle(pathname.match(/^\/news\/([^/]+)\/?$/)?.[1] ?? "");
  const casePrompts: string[] = caseWork
    ? askPromptsFor(caseWork)
    : article
      ? askPromptsForArticle(article)
      : /^\/news\/?$/.test(pathname)
        ? NEWS_PROMPTS
        : [];
  const [nudge, setNudge] = useState(false);

  const idRef = useRef(1);
  const scroller = useRef<HTMLDivElement>(null);
  const askRef = useRef<HTMLTextAreaElement>(null);
  const claimRef = useRef<HTMLTextAreaElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  const limitReached = calls >= SESSION_CAP;

  const toBottom = useCallback(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);
  useEffect(toBottom, [msgs, busy, truth, mode, toBottom]);

  const openAs = useCallback(
    (m: AskMode) => {
      opener.current = (document.activeElement as HTMLElement) ?? null;
      setMode(m === "process" && !guide ? "ask" : m);
      setOpen(true);
    },
    [guide]
  );

  const close = useCallback(() => {
    setOpen(false);
    const el = opener.current;
    if (el && document.contains(el)) el.focus();
  }, []);

  // Opened from the footer triangle panel (or anywhere) via openAskVeritas(mode)
  useEffect(() => {
    const on = (e: Event) => {
      const d = (e as CustomEvent<{ mode?: AskMode; question?: string }>).detail;
      openAs(d?.question ? "ask" : d?.mode ?? "ask");
      if (d?.question) setPending(d.question);
    };
    window.addEventListener(OPEN_EVENT, on);
    return () => window.removeEventListener(OPEN_EVENT, on);
  }, [openAs]);

  // The nav bar's triangle toggles the panel, and shows whether it is open.
  const openRef = useRef(false);
  useEffect(() => {
    openRef.current = open;
    window.dispatchEvent(new CustomEvent(STATE_EVENT, { detail: { open } }));
  }, [open]);
  useEffect(() => {
    const on = () => (openRef.current ? close() : openAs("ask"));
    window.addEventListener(TOGGLE_EVENT, on);
    return () => window.removeEventListener(TOGGLE_EVENT, on);
  }, [openAs, close]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => (mode === "truth" ? claimRef.current : askRef.current)?.focus(), 60);
    return () => clearTimeout(t);
  }, [open, mode]);

  const post = async (payload: object): Promise<{ ok: boolean; reply: string }> => {
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { reply?: string };
      return { ok: res.ok, reply: data.reply || `Something broke on our side. Email ${EMAIL}.` };
    } catch {
      return { ok: false, reply: `Something broke on our side. Email ${EMAIL}.` };
    }
  };

  const ask = async (raw: string) => {
    const text = raw.replace(/\s+/g, " ").trim().slice(0, MAX_CHARS);
    if (!text || busy || limitReached) return;
    const user: Msg = { id: idRef.current++, role: "user", text };
    const history = [...msgs, user].filter((m) => !m.local).map((m) => ({ role: m.role, content: m.text }));
    setMsgs((m) => [...m, user]);
    setInput("");
    setBusy(true);
    setCalls((c) => c + 1);
    const { ok, reply } = await post({ mode: "ask", messages: history });
    // errors and limit messages are shown but never echoed back to the model as history
    setMsgs((m) => [...m, { id: idRef.current++, role: "assistant", text: reply, local: !ok, type: !reduce }]);
    setBusy(false);
  };

  const test = async (raw: string) => {
    const text = raw.replace(/\s+/g, " ").trim().slice(0, MAX_CHARS);
    if (!text || busy || limitReached) return;
    setBusy(true);
    setCalls((c) => c + 1);
    setTruth(null);
    const { ok, reply } = await post({ mode: "truth", messages: [{ role: "user", content: text }] });
    setTruth({ id: idRef.current++, claim: text, raw: reply, verdict: ok ? parseVerdict(reply) : null });
    setClaim("");
    setBusy(false);
  };

  // A question passed in from outside (openAskVeritas or the nudge) is sent once the panel is open.
  useEffect(() => {
    if (!open || !pending || mode !== "ask") return;
    const q = pending;
    setPending(null);
    ask(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, pending, mode]);

  // The nudge: once per case study or article per visit, 2.5s after arriving, gone after 12s.
  const caseSlug = caseWork?.slug ?? (article ? `news/${article.slug}` : null);
  useEffect(() => {
    setNudge(false);
    if (!caseSlug || (triggerKind !== "triangle" && side !== "top")) return;
    let seen = false;
    try {
      seen = sessionStorage.getItem(`av-nudge:${caseSlug}`) === "1";
    } catch {}
    if (seen) return;
    const show = setTimeout(() => {
      setNudge(true);
      try {
        sessionStorage.setItem(`av-nudge:${caseSlug}`, "1");
      } catch {}
    }, 2500);
    const hide = setTimeout(() => setNudge(false), 14500);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, [caseSlug, triggerKind, side]);
  useEffect(() => {
    if (open) setNudge(false);
  }, [open]);

  const askFromNudge = (q: string) => {
    setNudge(false);
    openAs("ask");
    setPending(q);
  };

  const askAboutStage = () => {
    setMode("ask");
    ask(`Tell me more about the ${PROCESS[stage].name} stage.`);
  };

  const limitNote = (
    <p className="av-limit">
      That's the limit for this visit. For the longer conversation: <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
    </p>
  );

  const enterSubmits = (fn: () => void) => (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      fn();
    }
  };

  const s = PROCESS[stage];

  return (
    <>
      {triggerKind === "pill" && (
        <button
          type="button"
          className={`av-trigger av-${side}`}
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => (open ? close() : openAs("ask"))}
        >
          <span className="av-dot" aria-hidden="true" />
          Ask Veritas
        </button>
      )}

      {triggerKind === "triangle" && (
        <button
          type="button"
          className={`av-tri av-tri-${side}${open ? " av-tri-open" : ""}`}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-label={open ? "Close Ask Veritas" : "Ask Veritas, an AI assistant"}
          onClick={() => (open ? close() : openAs("ask"))}
        >
          <span className="av-tri-label" aria-hidden="true">
            {caseWork ? `Ask about ${caseWork.client}` : "Ask Veritas"}
          </span>
          <svg className="av-tri-icon" width="22" height="19" viewBox="0 0 22 19" fill="none" aria-hidden="true">
            <polygon points="11,1.6 20.4,17.4 1.6,17.4" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </button>
      )}

      <AnimatePresence>
        {nudge && !open && casePrompts[0] && (
          <motion.div
            key="nudge"
            className={`av-nudge av-nudge-${side}`}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.96 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            transition={reduce ? { duration: 0.15 } : { type: "spring", stiffness: 380, damping: 30 }}
          >
            <button type="button" className="av-nudge-q" onClick={() => askFromNudge(casePrompts[0])}>
              <span className="av-nudge-k">Ask Veritas</span>
              <span>{casePrompts[0]}{"\u00a0"}→</span>
            </button>
            <button type="button" className="av-nudge-x" aria-label="Dismiss" onClick={() => setNudge(false)}>
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.section
            role="dialog"
            aria-label="Ask Veritas, an AI assistant"
            className={`av-panel av-${side}`}
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.86, y: 16 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 10, transition: { duration: 0.16 } }}
            transition={reduce ? { duration: 0.15 } : { type: "spring", stiffness: 380, damping: 30 }}
          >
            <header className="av-head">
              <span className="av-title">Ask Veritas</span>
              <span className="av-badge">AI</span>
              <button type="button" className="av-close" aria-label="Close" onClick={close}>
                ✕
              </button>
            </header>

            <nav className="av-tabs" aria-label="Mode">
              {modes.map((m) => (
                <button
                  key={m.key}
                  type="button"
                  className="av-tab"
                  aria-pressed={mode === m.key}
                  onClick={() => setMode(m.key)}
                >
                  {m.label}
                </button>
              ))}
            </nav>

            {/* ----- Ask ----- */}
            {mode === "ask" && (
              <>
                <div ref={scroller} className="av-log" aria-live="polite">
                  {msgs.map((m, i) => (
                    <p key={m.id} className={m.role === "user" ? "av-msg av-user" : "av-msg av-bot"}>
                      {m.role === "assistant" && m.type && i === msgs.length - 1 ? (
                        <Typed
                          text={m.text}
                          onTick={toBottom}
                          onDone={() => setMsgs((all) => all.map((x) => (x.id === m.id ? { ...x, type: false } : x)))}
                        />
                      ) : (
                        m.text
                      )}
                    </p>
                  ))}
                  {busy && (
                    <p className="av-msg av-bot" aria-label="Veritas is thinking">
                      <span className="av-caret" />
                    </p>
                  )}
                  {msgs.length === 1 && (
                    <div className="av-chips">
                      {[...casePrompts, ...SUGGESTIONS.slice(0, casePrompts.length ? 1 : SUGGESTIONS.length)].map((q) => (
                        <button key={q} type="button" className="av-chip" onClick={() => ask(q)}>
                          {q}
                        </button>
                      ))}
                      <button type="button" className="av-chip av-chip-alt" onClick={() => setMode("truth")}>
                        Test a brand line: take the Truth Test →
                      </button>
                      {guide && (
                        <button type="button" className="av-chip av-chip-alt" onClick={() => setMode("process")}>
                          How we work: Truthful / Noticeable / Memorable →
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <form
                  className="av-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    ask(input);
                  }}
                >
                  {limitReached ? (
                    limitNote
                  ) : (
                    <>
                      <textarea
                        ref={askRef}
                        rows={1}
                        value={input}
                        maxLength={MAX_CHARS}
                        placeholder="Even a random thought."
                        aria-label="Your question"
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={enterSubmits(() => ask(input))}
                      />
                      <button type="submit" className="av-send" disabled={busy || !input.trim()} aria-label="Send">
                        →
                      </button>
                    </>
                  )}
                </form>
              </>
            )}

            {/* ----- Truth Test ----- */}
            {mode === "truth" && (
              <>
                <div ref={scroller} className="av-log" aria-live="polite">
                  <p className="av-msg av-bot">{TRUTH_INTRO}</p>
                  {truth && (
                    <div className="av-result">
                      <p className="av-claim">“{truth.claim}”</p>
                      {truth.verdict ? (
                        <VerdictCard key={truth.id} v={truth.verdict} animate={!reduce} onTick={toBottom} />
                      ) : (
                        <p className="av-msg av-bot">{truth.raw}</p>
                      )}
                    </div>
                  )}
                  {busy && (
                    <p className="av-msg av-bot" aria-label="Veritas is reading your line">
                      <span className="av-caret" />
                    </p>
                  )}
                </div>
                <form
                  className="av-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    test(claim);
                  }}
                >
                  {limitReached ? (
                    limitNote
                  ) : (
                    <>
                      <textarea
                        ref={claimRef}
                        rows={2}
                        value={claim}
                        maxLength={MAX_CHARS}
                        placeholder={truth ? "Test another line." : "Paste a tagline or brand claim."}
                        aria-label="Brand line to test"
                        onChange={(e) => setClaim(e.target.value)}
                        onKeyDown={enterSubmits(() => test(claim))}
                      />
                      <button type="submit" className="av-send av-send-wide" disabled={busy || !claim.trim()}>
                        Test
                      </button>
                    </>
                  )}
                </form>
              </>
            )}

            {/* ----- Process guide (local copy, no API call) ----- */}
            {mode === "process" && guide && (
              <>
                <div ref={scroller} className="av-log">
                  <p className="av-step-count">
                    {String(stage + 1).padStart(2, "0")} / {String(PROCESS.length).padStart(2, "0")}
                  </p>
                  <h3 className="av-step-name">{s.name}</h3>
                  <p className="av-msg av-bot">
                    {reduce ? s.copy : <Typed key={s.key} text={s.copy ?? ""} onTick={toBottom} />}
                  </p>
                </div>
                <div className="av-step-nav">
                  <button
                    type="button"
                    className="av-step-btn"
                    disabled={stage === 0}
                    onClick={() => setStage((v) => v - 1)}
                  >
                    ← Back
                  </button>
                  <button type="button" className="av-step-btn" disabled={busy || limitReached} onClick={askAboutStage}>
                    Ask about {s.name}
                  </button>
                  <button
                    type="button"
                    className="av-step-btn"
                    disabled={stage === PROCESS.length - 1}
                    onClick={() => setStage((v) => v + 1)}
                  >
                    Next →
                  </button>
                </div>
              </>
            )}

            <p className="av-fine">
              AI-generated, can be wrong. Your message goes to an AI provider (Anthropic) to write a reply; we don't
              store conversations.
            </p>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}

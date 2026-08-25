"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import type { DemoNoteContent } from "./notes";

/**
 * Tycho Systems demo layer. Shared by every client concept on this host.
 *
 * Off by default. Activated with `?demo=true` and then persisted in sessionStorage so the
 * salesperson can navigate a whole site with annotations on.
 *
 * Keeping it out of a normal visitor's page takes two separate things, and only the first
 * is obvious:
 *
 *  1. `getServerSnapshot` returns false, so the layer is absent from the server-rendered
 *     DOM.
 *  2. `DemoNote` takes an `id`, never the prose. Props of a "use client" component are
 *     serialised into the RSC flight payload even when the component renders null — so
 *     annotations passed as `children` shipped inside `self.__next_f.push(...)` on every
 *     page and were readable in view-source, while a DOM-based test saw nothing wrong.
 *
 * The layer is deliberately styled as no client's brand: it is Tycho's voice commenting on
 * the work, and it must never be mistaken for part of the design.
 */

export type DemoCategory =
  | "konvertering"
  | "lokal-seo"
  | "tillit"
  | "lead"
  | "portefolje"
  | "automatisering";

export const CATEGORY_LABEL: Record<DemoCategory, string> = {
  konvertering: "Konvertering",
  "lokal-seo": "Lokal SEO",
  tillit: "Tillit",
  lead: "Lead-fangst",
  portefolje: "Portefølje",
  automatisering: "Automatisering",
};

interface DemoContextValue {
  enabled: boolean;
  setEnabled: (value: boolean) => void;
  register: (id: string) => number;
}

const DemoContext = createContext<DemoContextValue>({
  enabled: false,
  setEnabled: () => {},
  register: () => 0,
});

const STORAGE_KEY = "tycho.demo";

/**
 * sessionStorage is an external store, so it is read through `useSyncExternalStore`
 * rather than mirrored into state from an effect. `getServerSnapshot` returns false, which
 * keeps the layer out of the server-rendered DOM — necessary, but on its own not sufficient;
 * see point 2 above.
 */
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return window.sessionStorage.getItem(STORAGE_KEY) === "on";
}

function getServerSnapshot() {
  return false;
}

function writeDemoState(value: boolean) {
  if (value) window.sessionStorage.setItem(STORAGE_KEY, "on");
  else window.sessionStorage.removeItem(STORAGE_KEY);
  for (const listener of listeners) listener();
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const enabled = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [order] = useState<Map<string, number>>(() => new Map());

  // `?demo=true` / `?demo=false` writes through to the store. This is an effect updating
  // an external system from the URL, not state being mirrored out of one.
  useEffect(() => {
    const fromQuery = new URLSearchParams(window.location.search).get("demo");
    if (fromQuery === "true" || fromQuery === "1") writeDemoState(true);
    else if (fromQuery === "false" || fromQuery === "0") writeDemoState(false);
  }, []);

  const setEnabled = useCallback((value: boolean) => writeDemoState(value), []);

  const register = useCallback(
    (id: string) => {
      if (!order.has(id)) order.set(id, order.size + 1);
      return order.get(id) ?? 0;
    },
    [order],
  );

  const value = useMemo(
    () => ({ enabled, setEnabled, register }),
    [enabled, setEnabled, register],
  );

  return (
    <DemoContext.Provider value={value}>
      {children}
      {enabled ? <DemoControl /> : null}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  return useContext(DemoContext);
}

/**
 * An inline annotation anchored to a real element on the page.
 * Renders nothing at all when the layer is off.
 *
 * Takes only an `id`. The prose lives in ./notes and is fetched with a dynamic `import()`
 * the first time the layer is switched on — see the note on the flight payload above. This
 * indirection is the requirement, not a refactor.
 */
export function DemoNote({ id, align = "start" }: { id: string; align?: "start" | "end" }) {
  const { enabled, register } = useDemo();
  const reactId = useId();
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState<DemoNoteContent | null>(null);
  const index = enabled ? register(reactId) : 0;

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    void import("./notes").then((mod) => {
      if (!cancelled) setContent(mod.DEMO_NOTES[id] ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, [enabled, id]);

  if (!enabled || !content) return null;

  return (
    <span className={`tsd-note tsd-note--${align}`} data-open={open || undefined}>
      <button
        type="button"
        className="tsd-note__pin"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={`tsd-swatch tsd-swatch--${content.category}`} aria-hidden="true" />
        <span className="tsd-note__num">{index}</span>
        <span className="tsd-note__cat">{CATEGORY_LABEL[content.category]}</span>
      </button>
      {open ? (
        <span className="tsd-note__body" role="note">
          <span className="tsd-note__title">{content.title}</span>
          <span className="tsd-note__text">{content.body}</span>
        </span>
      ) : null}
    </span>
  );
}

function DemoControl() {
  const { setEnabled } = useDemo();
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <aside className="tsd-control" aria-label="Tycho Systems konseptvisning">
      {expanded ? (
        <div className="tsd-control__panel">
          <p className="tsd-control__lead">
            Markørene på siden viser hvorfor elementene er der. Trykk på en markør for å se
            begrunnelsen.
          </p>
          <ul className="tsd-control__legend">
            {(Object.keys(CATEGORY_LABEL) as DemoCategory[]).map((key) => (
              <li key={key}>
                <span className={`tsd-swatch tsd-swatch--${key}`} aria-hidden="true" />
                {CATEGORY_LABEL[key]}
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="tsd-control__off"
            onClick={() => {
              setEnabled(false);
              setExpanded(false);
            }}
          >
            Skjul konseptvisning
          </button>
        </div>
      ) : null}
      <button
        type="button"
        className="tsd-control__toggle"
        aria-expanded={expanded}
        onClick={() => setExpanded((v) => !v)}
      >
        <span className="tsd-control__dot" aria-hidden="true" />
        Tycho Systems Concept
      </button>
    </aside>
  );
}

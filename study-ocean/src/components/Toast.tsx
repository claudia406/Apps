"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { CheckIcon, CloseIcon } from "@/components/icons";

type ToastKind = "success" | "error" | "info";

interface ToastItem {
  id: number;
  kind: ToastKind;
  message: string;
}

interface ToastContextValue {
  show: (message: string, kind?: ToastKind) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast は ToastProvider の内側で使用してください");
  return ctx;
}

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const show = useCallback((message: string, kind: ToastKind = "info") => {
    const id = ++idRef.current;
    setItems((prev) => [...prev, { id, kind, message }]);
    window.setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div
        className="fixed left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 items-center w-[calc(100%-32px)] max-w-sm"
        style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 84px)" }}
      >
        {items.map((t) => (
          <div
            key={t.id}
            className="animate-rise-in w-full flex items-center gap-2 rounded-2xl px-4 py-3 shadow-soft text-sm font-medium"
            style={{
              background: t.kind === "error" ? "var(--danger-bg)" : t.kind === "success" ? "var(--success-bg)" : "var(--surface)",
              color: t.kind === "error" ? "var(--danger)" : t.kind === "success" ? "var(--success)" : "var(--text)",
              border: "1px solid var(--border)",
            }}
            role="status"
          >
            {t.kind === "success" && <CheckIcon className="w-4 h-4 shrink-0" />}
            {t.kind === "error" && <CloseIcon className="w-4 h-4 shrink-0" />}
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

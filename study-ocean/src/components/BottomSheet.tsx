"use client";

import { useEffect, type ReactNode } from "react";
import { CloseIcon } from "@/components/icons";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function BottomSheet({ open, onClose, title, children }: BottomSheetProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-[#16302c]/35 backdrop-blur-[2px] animate-fade-in"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative z-10 w-full sm:max-w-md sm:rounded-[28px] rounded-t-[28px] bg-surface shadow-soft animate-rise-in max-h-[88vh] overflow-y-auto scrollbar-none"
        style={{ paddingBottom: "max(env(safe-area-inset-bottom), 20px)" }}
      >
        <div className="sticky top-0 bg-surface/95 backdrop-blur flex items-center justify-between px-5 pt-5 pb-3 border-b border-border/70">
          <h2 className="text-[17px] font-bold tracking-wide text-text">{title}</h2>
          <button
            onClick={onClose}
            aria-label="閉じる"
            className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:bg-surface-soft transition-colors"
          >
            <CloseIcon className="w-4.5 h-4.5" />
          </button>
        </div>
        <div className="px-5 pt-4 pb-2">{children}</div>
      </div>
    </div>
  );
}

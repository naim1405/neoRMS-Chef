import React, { useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "../ui-waiter/button";

export function RightPanel({ open, onClose, title, children }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl border-l border-neutral-200 flex flex-col z-50"
        style={{ animation: "slideInRight 0.3s ease-out" }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="right-panel-title"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 shrink-0">
          <h2 id="right-panel-title" className="text-lg font-semibold text-neutral-900">
            {title}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-9 w-9 rounded-full"
            aria-label="Close panel"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </aside>
    </div>
  );
}

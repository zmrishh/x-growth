import { ReactNode } from "react";

interface PageShellProps {
  children: ReactNode;
  className?: string;
}

export function PageShell({ children, className }: PageShellProps) {
  return (
    <main
      className={`flex-1 overflow-y-auto p-6 ${className ?? ""}`}
      style={{ background: "var(--color-bg-base)" }}
    >
      {children}
    </main>
  );
}

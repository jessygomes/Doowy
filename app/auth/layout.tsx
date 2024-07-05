import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex items-center justify-center bg-grey-50 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-grey-50 to-grey-400">
      {children}
    </div>
  );
}

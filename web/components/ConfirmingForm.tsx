"use client";
// Client wrapper around a destructive server-action form. Pops a native
// confirm() dialog before letting the form submit. Cancel = no-op, OK =
// the underlying server action runs and the row is gone.
//
// Native confirm() is intentional: it's a deletion guard, not a UI flourish.
// Modal dialogs for delete-confirm tend to be more friction than the
// benefit warrants for an indie productivity app.
import { useRef } from "react";

export default function ConfirmingForm({
  action,
  message,
  className,
  children,
}: {
  action: (formData: FormData) => void | Promise<void>;
  message: string;
  className?: string;
  children: React.ReactNode;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  return (
    <form
      ref={formRef}
      action={action}
      className={className}
      onSubmit={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </form>
  );
}

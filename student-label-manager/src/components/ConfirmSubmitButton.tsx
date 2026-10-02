"use client";

import type { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  confirmMessage: string;
}

export default function ConfirmSubmitButton({ confirmMessage, onClick, ...rest }: Props) {
  return (
    <button
      {...rest}
      type="submit"
      onClick={(e) => {
        if (!window.confirm(confirmMessage)) {
          e.preventDefault();
          return;
        }
        onClick?.(e);
      }}
    />
  );
}

"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type SelectOption = {
  readonly value: string;
  readonly label: string;
  readonly disabled?: boolean;
};

type SelectProps = {
  readonly id: string;
  readonly value?: string;
  readonly placeholder?: string;
  readonly options: readonly SelectOption[];
  readonly disabled?: boolean;
  readonly onChange: (nextValue: string) => void;
};

export function Select({
  id,
  value,
  placeholder = "Select...",
  options,
  disabled = false,
  onChange
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const listboxId = `${id}-listbox`;

  const selected = useMemo(
    () => options.find((option) => option.value === value),
    [options, value]
  );

  useEffect(() => {
    function onOutsideClick(event: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onOutsideClick);
    return () => document.removeEventListener("mousedown", onOutsideClick);
  }, []);

  function moveActive(direction: 1 | -1) {
    if (!options.length) return;
    let next = activeIndex;
    for (let step = 0; step < options.length; step += 1) {
      next = (next + direction + options.length) % options.length;
      if (!options[next]?.disabled) {
        setActiveIndex(next);
        break;
      }
    }
  }

  function selectAt(index: number) {
    const option = options[index];
    if (!option || option.disabled) return;
    onChange(option.value);
    setOpen(false);
  }

  return (
    <div ref={rootRef} style={{ position: "relative" }}>
      <button
        id={id}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            if (!open) setOpen(true);
            moveActive(1);
          } else if (event.key === "ArrowUp") {
            event.preventDefault();
            if (!open) setOpen(true);
            moveActive(-1);
          } else if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            if (!open) {
              setOpen(true);
            } else {
              selectAt(activeIndex);
            }
          } else if (event.key === "Escape") {
            setOpen(false);
          }
        }}
        style={{
          width: "100%",
          textAlign: "left",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-subtle)",
          background: disabled ? "rgb(20 30 50 / 40%)" : "var(--bg-surface-elevated)",
          color: disabled ? "var(--text-muted)" : "var(--text-primary)",
          padding: "var(--space-2) var(--space-3)",
          fontSize: "var(--text-sm)",
          cursor: disabled ? "not-allowed" : "pointer"
        }}
      >
        {selected?.label ?? placeholder}
      </button>

      {open ? (
        <ul
          id={listboxId}
          role="listbox"
          aria-labelledby={id}
          tabIndex={-1}
          style={{
            position: "absolute",
            zIndex: 20,
            top: "calc(100% + var(--space-2))",
            left: 0,
            right: 0,
            margin: 0,
            padding: "var(--space-1)",
            listStyle: "none",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-subtle)",
            background: "var(--bg-surface)",
            boxShadow: "var(--shadow-md)",
            maxHeight: "220px",
            overflowY: "auto"
          }}
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isActive = index === activeIndex;
            return (
              <li key={option.value} role="none">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  disabled={option.disabled}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => selectAt(index)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    border: "none",
                    borderRadius: "var(--radius-sm)",
                    padding: "var(--space-2) var(--space-3)",
                    fontSize: "var(--text-sm)",
                    color: option.disabled ? "var(--text-muted)" : "var(--text-primary)",
                    background: isActive || isSelected ? "rgb(110 168 254 / 18%)" : "transparent",
                    cursor: option.disabled ? "not-allowed" : "pointer"
                  }}
                >
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

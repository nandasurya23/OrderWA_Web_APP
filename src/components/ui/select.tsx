"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export type SelectOption<T extends string> = {
  label: string;
  value: T;
};

type SelectProps<T extends string> = {
  ariaLabel?: string;
  className?: string;
  disabled?: boolean;
  id?: string;
  onChange: (value: T) => void;
  options: SelectOption<T>[];
  placeholder?: string;
  value: T;
};

export function Select<T extends string>({
  ariaLabel,
  className,
  disabled = false,
  id,
  onChange,
  options,
  placeholder = "Pilih opsi",
  value,
}: SelectProps<T>) {
  const reactId = useId();
  const selectId = id ?? `select-${reactId}`;
  const listboxId = `${selectId}-listbox`;
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value) ?? null,
    [options, value],
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }

      if (wrapperRef.current?.contains(target)) {
        return;
      }

      setIsOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    }

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const selectedIndex = options.findIndex((option) => option.value === value);
    const nextActiveIndex = selectedIndex >= 0 ? selectedIndex : 0;
    setActiveIndex(nextActiveIndex);
    optionRefs.current[nextActiveIndex]?.focus();
  }, [isOpen, options, value]);

  function commitSelection(index: number) {
    const option = options[index];
    if (!option) {
      return;
    }

    onChange(option.value);
    setIsOpen(false);
    buttonRef.current?.focus();
  }

  function moveActiveIndex(direction: "next" | "prev") {
    if (!options.length) {
      return;
    }

    const current = activeIndex >= 0 ? activeIndex : 0;
    const nextIndex =
      direction === "next"
        ? (current + 1) % options.length
        : (current - 1 + options.length) % options.length;

    setActiveIndex(nextIndex);
    optionRefs.current[nextIndex]?.focus();
  }

  return (
    <div ref={wrapperRef} className={cn("relative w-full", className)}>
      <button
        ref={buttonRef}
        id={selectId}
        type="button"
        role="combobox"
        aria-controls={listboxId}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            if (!isOpen) {
              setIsOpen(true);
              return;
            }

            moveActiveIndex(event.key === "ArrowDown" ? "next" : "prev");
            return;
          }

          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setIsOpen((prev) => !prev);
          }
        }}
        className={cn(
          "min-h-11 w-full rounded-[1.1rem] border border-[var(--border)] bg-[rgba(255,255,255,0.94)] px-4 py-2.5 text-left text-sm text-[var(--foreground)] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] transition-[border-color,box-shadow,background-color] duration-200 focus-visible:border-[var(--accent)] focus-visible:bg-[var(--surface)] focus-visible:outline-none focus-visible:shadow-[0_0_0_4px_rgba(15,58,114,0.11)] disabled:cursor-not-allowed disabled:bg-[var(--surface-muted)]",
          isOpen ? "border-[var(--accent)] bg-[var(--surface)]" : "",
        )}
      >
        <span className={cn("block truncate", !selectedOption && "text-[var(--foreground-muted)]")}>
          {selectedOption?.label ?? placeholder}
        </span>
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--foreground-muted)] transition-transform duration-200",
            isOpen ? "rotate-180 text-[var(--accent)]" : "",
          )}
        />
      </button>

      <div
        className={cn(
          "absolute left-0 right-0 top-[calc(100%+0.4rem)] z-30 origin-top rounded-[1.1rem] border border-[var(--border)] bg-[var(--surface)] p-1.5 shadow-[var(--shadow-soft)] transition-all duration-150",
          isOpen
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none scale-[0.98] opacity-0",
        )}
      >
        <div id={listboxId} role="listbox" aria-labelledby={selectId} className="max-h-64 overflow-auto">
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isActive = index === activeIndex;

            return (
              <button
                key={option.value}
                ref={(node) => {
                  optionRefs.current[index] = node;
                }}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => commitSelection(index)}
                onFocus={() => setActiveIndex(index)}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    moveActiveIndex("next");
                    return;
                  }

                  if (event.key === "ArrowUp") {
                    event.preventDefault();
                    moveActiveIndex("prev");
                    return;
                  }

                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    commitSelection(index);
                  }
                }}
                className={cn(
                  "flex w-full items-center justify-between gap-3 rounded-[0.9rem] px-3 py-2.5 text-left text-sm transition-colors duration-150 focus-visible:outline-none",
                  isSelected
                    ? "bg-[rgba(15,58,114,0.1)] text-[var(--foreground)]"
                    : isActive
                    ? "bg-[var(--surface-muted)] text-[var(--foreground)]"
                    : "text-[var(--foreground-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]",
                )}
              >
                <span className="truncate">{option.label}</span>
                {isSelected ? <Check aria-hidden="true" className="h-4 w-4 text-[var(--accent)]" /> : null}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

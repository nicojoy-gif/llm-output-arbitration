"use client";

import { useRef, type KeyboardEvent } from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Question } from "@/types/arbitration";

export function QuestionSelector({
  questions,
  value,
  onChange,
  disabled = false,
}: {
  questions: readonly Question[];
  value: number | null;
  onChange: (id: number) => void;
  disabled?: boolean;
}) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const selectedIndex = questions.findIndex((q) => q.id === value);
  const focusIndex = selectedIndex === -1 ? 0 : selectedIndex;

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const keys: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    const delta = keys[event.key];
    if (delta === undefined) return;
    event.preventDefault();
    const next = (index + delta + questions.length) % questions.length;
    refs.current[next]?.focus();
    onChange(questions[next].id);
  }

  return (
    <div role="radiogroup" aria-label="Benchmark question" className="grid gap-2">
      {questions.map((question, index) => {
        const selected = question.id === value;
        return (
          <button
            key={question.id}
            ref={(node) => {
              refs.current[index] = node;
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={index === focusIndex ? 0 : -1}
            disabled={disabled}
            onClick={() => onChange(question.id)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={cn(
              "group flex w-full cursor-pointer items-center gap-3 rounded-md border bg-card px-3 py-3 text-left text-sm outline-none transition-colors hover:border-primary/40 hover:bg-accent/40 focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-60",
              selected && "border-primary bg-accent/60 hover:bg-accent/60",
            )}
          >
            <span
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-md border font-mono text-xs text-muted-foreground",
                selected && "border-primary bg-primary text-primary-foreground",
              )}
            >
              {selected ? <Check className="size-3.5" aria-hidden /> : question.id}
            </span>
            <span className={cn("flex-1", selected && "font-medium")}>{question.question}</span>
          </button>
        );
      })}
    </div>
  );
}

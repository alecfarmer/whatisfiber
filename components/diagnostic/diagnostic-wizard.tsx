"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  activeQuestions,
  isComplete,
  questions,
  resolveVerdict,
  verdicts,
  type Answers,
  type Question,
  type QuestionId,
  type VerdictId,
} from "@/lib/diagnostic";
import { VerdictCard } from "./verdict-card";
import { cn } from "@/lib/utils";
import { ArrowIcon } from "@/components/ui/cta";

const EASE = [0.16, 1, 0.3, 1] as const;

const QUICK_PICKS: { label: string; presets: Partial<Answers> }[] = [
  {
    label: "It's just my Wi-Fi",
    presets: { symptom: "pages", scope: "rooms" },
  },
  {
    label: "Calls keep dropping",
    presets: { symptom: "calls" },
  },
  {
    label: "It crawls at night",
    presets: { symptom: "everything", timing: "evenings" },
  },
  {
    label: "Uploads are awful",
    presets: { symptom: "upload" },
  },
  {
    label: "Gaming lag",
    presets: { symptom: "gaming" },
  },
];

export function DiagnosticWizard({
  initialAnswers,
}: {
  initialAnswers?: Answers;
}) {
  const [answers, setAnswers] = useState<Answers>(initialAnswers ?? {});
  const reduce = useReducedMotion();

  const active = useMemo(() => activeQuestions(answers), [answers]);
  const answeredCount = active.filter((q) => answers[q.id]).length;
  const total = active.length;
  const progress = total > 0 ? answeredCount / total : 0;

  const currentQuestion = active.find((q) => !answers[q.id]);
  const complete = isComplete(answers);

  function pick(qId: QuestionId, optionId: string) {
    setAnswers((prev) => ({ ...prev, [qId]: optionId }));
  }

  function back() {
    setAnswers((prev) => {
      const filled = Object.keys(prev) as QuestionId[];
      if (filled.length === 0) return prev;
      const last = filled[filled.length - 1];
      const { [last]: _drop, ...rest } = prev;
      void _drop;
      return rest;
    });
  }

  function restart() {
    setAnswers({});
  }

  function loadPreset(presets: Partial<Answers>) {
    setAnswers(presets);
  }

  if (complete) {
    const verdictId = resolveVerdict(answers);
    return (
      <VerdictCard
        verdict={verdicts[verdictId]}
        onRestart={restart}
        showRunFullCta={false}
      />
    );
  }

  // Show quick picks ONLY when we're at the very first question and no
  // answers have been recorded yet.
  const showQuickPicks =
    Object.keys(answers).length === 0 && currentQuestion?.id === "symptom";

  return (
    <div className="relative overflow-hidden rounded-[24px] border border-[var(--border-soft)] bg-gradient-to-br from-[var(--ink-card)] to-[var(--ink-raised)] p-6 sm:p-10">
      <div className="mb-8">
        <div className="mono mb-2 flex items-center justify-between text-[11px] uppercase tracking-[0.22em] text-[var(--fg-faint)]">
          <span>
            Question {Math.min(answeredCount + 1, total)} of {total}
          </span>
          <span className="text-[var(--accent-text)]">Diagnostic</span>
        </div>
        <div className="h-px w-full overflow-hidden rounded-full bg-[var(--ink-elev)]">
          <motion.div
            className="h-full bg-[var(--accent)]"
            initial={false}
            animate={{ width: `${Math.max(progress, 0.05) * 100}%` }}
            transition={{ duration: 0.4, ease: EASE }}
          />
        </div>
      </div>

      {showQuickPicks && (
        <div className="mb-8 rounded-2xl border border-[var(--border-soft)] bg-[var(--ink-raised)]/60 p-5">
          <div className="mono mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--fg-faint)]">
            Or skip ahead
          </div>
          <div className="flex flex-wrap gap-2">
            {QUICK_PICKS.map((qp) => (
              <button
                key={qp.label}
                type="button"
                onClick={() => loadPreset(qp.presets)}
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-soft)] bg-[var(--ink)] px-3.5 py-1.5 text-[12.5px] text-[var(--fg-muted)] transition-colors hover:border-[var(--accent)]/60 hover:bg-[var(--ink-card)] hover:text-[var(--accent-text)]"
              >
                {qp.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {currentQuestion && (
        <motion.div
          key={currentQuestion.id}
          initial={reduce ? { opacity: 0 } : { opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.28, ease: EASE }}
        >
          <QuestionView
            question={currentQuestion}
            onPick={(optId) => pick(currentQuestion.id, optId)}
          />
        </motion.div>
      )}

      <footer className="mt-8 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={back}
          disabled={Object.keys(answers).length === 0}
          className={cn(
            "mono inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.18em] transition-colors",
            Object.keys(answers).length === 0
              ? "cursor-not-allowed text-[var(--fg-faint)]"
              : "text-[var(--fg-muted)] hover:text-[var(--accent-text)]",
          )}
        >
          <ArrowIcon className="rotate-180" />
          Back
        </button>
        <button
          type="button"
          onClick={restart}
          className="mono text-[11px] uppercase tracking-[0.18em] text-[var(--fg-dim)] hover:text-[var(--accent-text)]"
        >
          Start over
        </button>
      </footer>
    </div>
  );
}

function QuestionView({
  question,
  onPick,
}: {
  question: Question;
  onPick: (optionId: string) => void;
}) {
  return (
    <div>
      <header className="mb-6">
        <h3 className="display text-[clamp(22px,3vw,32px)] font-medium leading-[1.1] text-[var(--fg)]">
          {question.prompt}
        </h3>
        {question.sub ? (
          <p className="mt-2 max-w-[60ch] text-[14.5px] text-[var(--fg-muted)]">
            {question.sub}
          </p>
        ) : null}
      </header>
      <div className="grid gap-2.5 sm:grid-cols-2">
        {question.options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onPick(opt.id)}
            className="group flex flex-col items-start gap-1 rounded-2xl border border-[var(--border-soft)] bg-[var(--ink-raised)] p-4 text-left transition-all hover:-translate-y-0.5 hover:border-[var(--border-warm)] hover:bg-[var(--ink-card)]"
          >
            <span className="text-[15px] font-medium text-[var(--fg)] transition-colors group-hover:text-[var(--accent-text)]">
              {opt.label}
            </span>
            {opt.hint ? (
              <span className="text-[12.5px] text-[var(--fg-dim)]">
                {opt.hint}
              </span>
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );
}

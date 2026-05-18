"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  calculatePrecise,
  calculateQuick,
  camerasOptions,
  fourKtvsOptions,
  livestreamOptions,
  quickExtrasOptions,
  quickFrustrationOptions,
  quickHouseholdOptions,
  quickStreamsOptions,
  quickWfhOptions,
  selfhostOptions,
  uploadPatternOptions,
  type Option,
  type PreciseAnswers,
  type QuickAnswers,
  type QuickExtra,
  type Recommendation,
} from "@/lib/quiz";
import { ArrowIcon } from "@/components/ui/cta";
import { FiberLookup } from "@/components/fiber-lookup/fiber-lookup";

type QuizPhase = "choose" | "quick" | "precise" | "result";

const EASE = [0.16, 1, 0.3, 1] as const;

export function QuizWizard({
  initialMode,
  variant = "page",
}: {
  initialMode?: "quick" | "precise";
  /** "page" = full-page wizard; "inline" = compact, shows only the chooser. */
  variant?: "page" | "inline";
}) {
  const [phase, setPhase] = useState<QuizPhase>(initialMode ?? "choose");
  const [quickAnswers, setQuickAnswers] = useState<Partial<QuickAnswers>>({
    extras: [],
  });
  const [preciseAnswers, setPreciseAnswers] = useState<Partial<PreciseAnswers>>(
    { extras: [] },
  );
  const [rec, setRec] = useState<Recommendation | null>(null);
  const reduce = useReducedMotion();

  function restart() {
    setPhase("choose");
    setQuickAnswers({ extras: [] });
    setPreciseAnswers({ extras: [] });
    setRec(null);
  }

  // For the inline hero variant we only ever show the mode chooser, then
  // bounce the user to the full page experience.
  if (variant === "inline") {
    return (
      <ModeChooser
        onPick={(m) => {
          if (typeof window !== "undefined") {
            window.location.href = `/is-fiber-worth-it?mode=${m}`;
          }
        }}
        compact
      />
    );
  }

  return (
    <div className="relative overflow-hidden rounded-[24px] border border-[var(--border-soft)] bg-gradient-to-br from-[var(--ink-card)] to-[var(--ink-raised)] p-6 sm:p-10">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={phase}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: EASE }}
        >
          {phase === "choose" && (
            <ModeChooser
              onPick={(m) => setPhase(m === "quick" ? "quick" : "precise")}
            />
          )}
          {phase === "quick" && (
            <QuickQuiz
              answers={quickAnswers}
              onAnswers={setQuickAnswers}
              onComplete={(a) => {
                setRec(calculateQuick(a));
                setPhase("result");
              }}
              onBackToChooser={restart}
            />
          )}
          {phase === "precise" && (
            <PreciseQuiz
              answers={preciseAnswers}
              onAnswers={setPreciseAnswers}
              onComplete={(a) => {
                setRec(calculatePrecise(a));
                setPhase("result");
              }}
              onBackToChooser={restart}
            />
          )}
          {phase === "result" && rec && (
            <ResultPanel
              rec={rec}
              onRestart={restart}
              onUpgradeToPrecise={
                rec.mode === "quick"
                  ? () => {
                      // Carry over the quick answers; they're a subset of precise
                      const carry = quickAnswers;
                      setPreciseAnswers({
                        ...(carry as Partial<PreciseAnswers>),
                        fourKtvs: undefined,
                        livestream: undefined,
                        cameras: undefined,
                        selfhost: undefined,
                        uploadPattern: undefined,
                      });
                      setRec(null);
                      setPhase("precise");
                    }
                  : undefined
              }
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ── Mode chooser ─────────────────────────────────────────────────────────

function ModeChooser({
  onPick,
  compact = false,
}: {
  onPick: (m: "quick" | "precise") => void;
  compact?: boolean;
}) {
  return (
    <div>
      {!compact && (
        <header className="mb-7">
          <div className="mono text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--accent-text)]">
            Pick your quiz
          </div>
          <h2 className="display mt-3 text-[clamp(26px,3.8vw,38px)] font-medium leading-[1.08] text-[var(--fg)]">
            How honest do you want to be?
          </h2>
          <p className="mt-3 max-w-[58ch] text-[14.5px] leading-relaxed text-[var(--fg-muted)]">
            Both run in your browser. No email, no sign-up.
          </p>
        </header>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        <ChooserCard
          eyebrow="Quick"
          title="The fast read"
          meta="~60 sec · 5 questions"
          body="A range, not a single number. Best when you want a gut-check."
          cta="Start quick"
          tone="accent"
          onClick={() => onPick("quick")}
        />
        <ChooserCard
          eyebrow="Precise"
          title="The tighter answer"
          meta="~3 min · 10 questions"
          body="Adds livestream, cameras, self-hosting, weekly upload volume."
          cta="Start precise"
          tone="edge"
          onClick={() => onPick("precise")}
        />
      </div>
      {!compact && (
        <p className="mono mt-5 text-[10.5px] leading-relaxed text-[var(--fg-faint)]">
          Both show ranges, name the cable plan that would also fit, and
          refuse to push multi-gig unless your answers actually need it.
        </p>
      )}
    </div>
  );
}

function ChooserCard({
  eyebrow,
  title,
  meta,
  body,
  cta,
  tone,
  onClick,
}: {
  eyebrow: string;
  title: string;
  meta: string;
  body: string;
  cta: string;
  tone: "accent" | "edge";
  onClick: () => void;
}) {
  const toneVar =
    tone === "accent" ? "var(--accent-text)" : "var(--status-edge)";
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex h-full flex-col items-start gap-3 overflow-hidden rounded-2xl border border-[var(--border-soft)] bg-[var(--ink-raised)] p-5 text-left transition-all hover:-translate-y-0.5 hover:border-[var(--border-warm)] hover:bg-[var(--ink-card)]"
    >
      <div className="flex w-full items-baseline justify-between gap-3">
        <span
          className="mono text-[10px] font-bold uppercase tracking-[0.22em]"
          style={{ color: toneVar }}
        >
          {eyebrow}
        </span>
        <span className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--fg-faint)]">
          {meta}
        </span>
      </div>
      <div className="display text-[22px] font-medium leading-tight text-[var(--fg)]">
        {title}
      </div>
      <p className="text-[13px] leading-relaxed text-[var(--fg-muted)]">
        {body}
      </p>
      <span
        className="mono mt-auto inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] transition-all group-hover:translate-x-0.5"
        style={{
          color: toneVar,
          borderColor: `color-mix(in oklch, ${toneVar} 50%, transparent)`,
        }}
      >
        {cta}
        <ArrowIcon />
      </span>
    </button>
  );
}

// ── Quick quiz ────────────────────────────────────────────────────────────

const QUICK_STEPS = [
  "household",
  "wfh",
  "streams",
  "extras",
  "frustration",
] as const;
type QuickStep = (typeof QUICK_STEPS)[number];

const quickTitles: Record<QuickStep, { title: string; sub?: string }> = {
  household: {
    title: "How many people share your internet?",
    sub: "Roommates, family, anyone touching your Wi-Fi.",
  },
  wfh: {
    title: "Anyone working from home regularly?",
    sub: "Daily video calls and screen sharing care a lot about internet quality.",
  },
  streams: {
    title: "How many streams running at the same time?",
    sub: "Netflix, YouTube, Disney+, Twitch — whatever plays at once.",
  },
  extras: {
    title: "Anything else?",
    sub: "Tap all that apply. Skip if nothing fits.",
  },
  frustration: {
    title: "How frustrated are you with your current internet?",
    sub: "Be honest — if it's working, the answer is 'never.'",
  },
};

function QuickQuiz({
  answers,
  onAnswers,
  onComplete,
  onBackToChooser,
}: {
  answers: Partial<QuickAnswers>;
  onAnswers: (a: Partial<QuickAnswers>) => void;
  onComplete: (a: QuickAnswers) => void;
  onBackToChooser: () => void;
}) {
  const [step, setStep] = useState<QuickStep>("household");
  const reduce = useReducedMotion();
  const stepIndex = QUICK_STEPS.indexOf(step);

  function canContinue(): boolean {
    switch (step) {
      case "household":
        return !!answers.household;
      case "wfh":
        return !!answers.wfh;
      case "streams":
        return !!answers.streams;
      case "extras":
        return true;
      case "frustration":
        return !!answers.frustration;
    }
  }

  function next() {
    if (stepIndex === QUICK_STEPS.length - 1) {
      if (
        answers.household &&
        answers.wfh &&
        answers.streams &&
        answers.frustration
      ) {
        onComplete(answers as QuickAnswers);
      }
      return;
    }
    setStep(QUICK_STEPS[stepIndex + 1]);
  }
  function back() {
    if (stepIndex === 0) {
      onBackToChooser();
      return;
    }
    setStep(QUICK_STEPS[stepIndex - 1]);
  }

  function pickSingle<K extends "household" | "wfh" | "streams" | "frustration">(
    key: K,
    value: QuickAnswers[K],
  ) {
    const updated = { ...answers, [key]: value };
    onAnswers(updated);
    // Auto-advance only when it's a fresh answer
    if (!answers[key]) setTimeout(next, 250);
  }
  function toggleExtra(value: QuickExtra) {
    const set = new Set<QuickExtra>(answers.extras ?? []);
    if (set.has(value)) set.delete(value);
    else set.add(value);
    onAnswers({ ...answers, extras: [...set] });
  }

  return (
    <WizardFrame
      total={QUICK_STEPS.length}
      current={stepIndex}
      modeLabel="Quick"
      stepLabel={step.toUpperCase()}
      onBack={back}
      onNext={canContinue() ? next : undefined}
      nextLabel={
        stepIndex === QUICK_STEPS.length - 1 ? "See my answer" : "Continue"
      }
      title={quickTitles[step].title}
      sub={quickTitles[step].sub}
      reduce={reduce}
      stepKey={step}
    >
      {step === "household" && (
        <OptionGrid
          options={quickHouseholdOptions}
          selected={answers.household}
          onPick={(v) => pickSingle("household", v)}
        />
      )}
      {step === "wfh" && (
        <OptionGrid
          options={quickWfhOptions}
          selected={answers.wfh}
          onPick={(v) => pickSingle("wfh", v)}
        />
      )}
      {step === "streams" && (
        <OptionGrid
          options={quickStreamsOptions}
          selected={answers.streams}
          onPick={(v) => pickSingle("streams", v)}
        />
      )}
      {step === "extras" && (
        <ExtrasGrid<QuickExtra>
          options={quickExtrasOptions}
          selected={answers.extras ?? []}
          onToggle={toggleExtra}
        />
      )}
      {step === "frustration" && (
        <OptionGrid
          options={quickFrustrationOptions}
          selected={answers.frustration}
          onPick={(v) => pickSingle("frustration", v)}
        />
      )}
    </WizardFrame>
  );
}

// ── Precise quiz ──────────────────────────────────────────────────────────

const PRECISE_STEPS = [
  ...QUICK_STEPS,
  "fourKtvs",
  "livestream",
  "cameras",
  "selfhost",
  "uploadPattern",
] as const;
type PreciseStep = (typeof PRECISE_STEPS)[number];

const preciseExtraTitles: Record<
  Exclude<PreciseStep, QuickStep>,
  { title: string; sub?: string }
> = {
  fourKtvs: {
    title: "How many 4K TVs in active use?",
    sub: "4K streams use more bandwidth than HD — a few of them at once changes the math.",
  },
  livestream: {
    title: "Anyone livestream regularly?",
    sub: "Twitch, YouTube Live, TikTok Live, OBS — outbound streams are upload-heavy.",
  },
  cameras: {
    title: "How many 4K security cameras uploading to the cloud?",
    sub: "Cloud cameras are always-on upload. 4K compounds quickly.",
  },
  selfhost: {
    title: "Do you self-host anything?",
    sub: "Plex remote, home server, NAS-to-cloud, Home Assistant remote, game server.",
  },
  uploadPattern: {
    title: "Which upload pattern matches you best?",
    sub: "Total volume you push OUT of your home per week.",
  },
};

function PreciseQuiz({
  answers,
  onAnswers,
  onComplete,
  onBackToChooser,
}: {
  answers: Partial<PreciseAnswers>;
  onAnswers: (a: Partial<PreciseAnswers>) => void;
  onComplete: (a: PreciseAnswers) => void;
  onBackToChooser: () => void;
}) {
  const [step, setStep] = useState<PreciseStep>("household");
  const reduce = useReducedMotion();
  const stepIndex = PRECISE_STEPS.indexOf(step);
  const lastIndex = PRECISE_STEPS.length - 1;

  function canContinue(): boolean {
    switch (step) {
      case "household":
        return !!answers.household;
      case "wfh":
        return !!answers.wfh;
      case "streams":
        return !!answers.streams;
      case "extras":
        return true;
      case "frustration":
        return !!answers.frustration;
      case "fourKtvs":
        return !!answers.fourKtvs;
      case "livestream":
        return !!answers.livestream;
      case "cameras":
        return !!answers.cameras;
      case "selfhost":
        return !!answers.selfhost;
      case "uploadPattern":
        return !!answers.uploadPattern;
    }
  }

  function next() {
    if (stepIndex === lastIndex) {
      if (isFullyAnswered(answers)) onComplete(answers as PreciseAnswers);
      return;
    }
    setStep(PRECISE_STEPS[stepIndex + 1]);
  }
  function back() {
    if (stepIndex === 0) {
      onBackToChooser();
      return;
    }
    setStep(PRECISE_STEPS[stepIndex - 1]);
  }

  function pickSingle<K extends keyof PreciseAnswers>(
    key: K,
    value: PreciseAnswers[K],
  ) {
    const updated = { ...answers, [key]: value };
    onAnswers(updated);
    if (!answers[key]) setTimeout(next, 250);
  }
  function toggleExtra(value: QuickExtra) {
    const set = new Set<QuickExtra>(answers.extras ?? []);
    if (set.has(value)) set.delete(value);
    else set.add(value);
    onAnswers({ ...answers, extras: [...set] });
  }

  const titleData =
    step === "household" ||
    step === "wfh" ||
    step === "streams" ||
    step === "extras" ||
    step === "frustration"
      ? quickTitles[step]
      : preciseExtraTitles[step];

  return (
    <WizardFrame
      total={PRECISE_STEPS.length}
      current={stepIndex}
      modeLabel="Precise"
      stepLabel={step.toUpperCase()}
      onBack={back}
      onNext={canContinue() ? next : undefined}
      nextLabel={stepIndex === lastIndex ? "See my answer" : "Continue"}
      title={titleData.title}
      sub={titleData.sub}
      reduce={reduce}
      stepKey={step}
    >
      {step === "household" && (
        <OptionGrid
          options={quickHouseholdOptions}
          selected={answers.household}
          onPick={(v) => pickSingle("household", v)}
        />
      )}
      {step === "wfh" && (
        <OptionGrid
          options={quickWfhOptions}
          selected={answers.wfh}
          onPick={(v) => pickSingle("wfh", v)}
        />
      )}
      {step === "streams" && (
        <OptionGrid
          options={quickStreamsOptions}
          selected={answers.streams}
          onPick={(v) => pickSingle("streams", v)}
        />
      )}
      {step === "extras" && (
        <ExtrasGrid<QuickExtra>
          options={quickExtrasOptions}
          selected={answers.extras ?? []}
          onToggle={toggleExtra}
        />
      )}
      {step === "frustration" && (
        <OptionGrid
          options={quickFrustrationOptions}
          selected={answers.frustration}
          onPick={(v) => pickSingle("frustration", v)}
        />
      )}
      {step === "fourKtvs" && (
        <OptionGrid
          options={fourKtvsOptions}
          selected={answers.fourKtvs}
          onPick={(v) => pickSingle("fourKtvs", v)}
        />
      )}
      {step === "livestream" && (
        <OptionGrid
          options={livestreamOptions}
          selected={answers.livestream}
          onPick={(v) => pickSingle("livestream", v)}
        />
      )}
      {step === "cameras" && (
        <OptionGrid
          options={camerasOptions}
          selected={answers.cameras}
          onPick={(v) => pickSingle("cameras", v)}
        />
      )}
      {step === "selfhost" && (
        <OptionGrid
          options={selfhostOptions}
          selected={answers.selfhost}
          onPick={(v) => pickSingle("selfhost", v)}
        />
      )}
      {step === "uploadPattern" && (
        <OptionGrid
          options={uploadPatternOptions}
          selected={answers.uploadPattern}
          onPick={(v) => pickSingle("uploadPattern", v)}
        />
      )}
    </WizardFrame>
  );
}

function isFullyAnswered(a: Partial<PreciseAnswers>): boolean {
  return (
    !!a.household &&
    !!a.wfh &&
    !!a.streams &&
    !!a.frustration &&
    !!a.fourKtvs &&
    !!a.livestream &&
    !!a.cameras &&
    !!a.selfhost &&
    !!a.uploadPattern
  );
}

// ── Shared wizard chrome ─────────────────────────────────────────────────

function WizardFrame({
  total,
  current,
  modeLabel,
  stepLabel,
  onBack,
  onNext,
  nextLabel,
  title,
  sub,
  children,
  reduce,
  stepKey,
}: {
  total: number;
  current: number;
  modeLabel: string;
  stepLabel: string;
  onBack: () => void;
  onNext?: () => void;
  nextLabel: string;
  title: string;
  sub?: string;
  children: React.ReactNode;
  reduce: boolean | null;
  stepKey: string;
}) {
  const progress = (current + 1) / total;
  return (
    <div>
      <div className="mb-7">
        <div className="mono mb-2 flex items-center justify-between text-[11px] uppercase tracking-[0.22em] text-[var(--fg-faint)]">
          <span>
            <span className="text-[var(--accent-text)]">{modeLabel}</span> · Step{" "}
            {current + 1} of {total}
          </span>
          <span className="text-[var(--fg-dim)]">{stepLabel}</span>
        </div>
        <div className="h-px w-full overflow-hidden rounded-full bg-[var(--ink-elev)]">
          <motion.div
            className="h-full bg-[var(--accent)]"
            initial={false}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.4, ease: EASE }}
          />
        </div>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={stepKey}
          initial={reduce ? { opacity: 0 } : { opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, x: -24 }}
          transition={{ duration: 0.28, ease: EASE }}
        >
          <header className="mb-6">
            <h3 className="display text-[clamp(22px,3vw,32px)] font-medium leading-[1.1] text-[var(--fg)]">
              {title}
            </h3>
            {sub ? (
              <p className="mt-2 max-w-[58ch] text-[14px] text-[var(--fg-muted)]">
                {sub}
              </p>
            ) : null}
          </header>
          {children}
        </motion.div>
      </AnimatePresence>
      <footer className="mt-8 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="mono inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--fg-muted)] transition-colors hover:text-[var(--accent-text)]"
        >
          <ArrowIcon className="rotate-180" />
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!onNext}
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-[14px] font-medium transition-all",
            onNext
              ? "bg-[var(--accent)] text-[var(--ink-deepest)] shadow-[0_8px_24px_-12px_var(--accent-shadow)] hover:bg-[var(--accent-bright)]"
              : "cursor-not-allowed bg-[var(--ink-elev)] text-[var(--fg-faint)]",
          )}
        >
          {nextLabel}
          <ArrowIcon />
        </button>
      </footer>
    </div>
  );
}

function OptionGrid<V extends string>({
  options,
  selected,
  onPick,
}: {
  options: Option<V>[];
  selected: V | undefined;
  onPick: (v: V) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {options.map((opt) => {
        const isActive = selected === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onPick(opt.value)}
            className={cn(
              "group relative flex flex-col items-start gap-1 rounded-2xl border p-5 text-left transition-all",
              isActive
                ? "border-[var(--accent)] bg-[var(--accent)]/8 shadow-[0_0_24px_-12px_var(--accent-shadow)]"
                : "border-[var(--border-soft)] bg-[var(--ink-raised)] hover:-translate-y-0.5 hover:border-[var(--border-warm)] hover:bg-[var(--ink-card)]",
            )}
          >
            {opt.big ? (
              <div
                className={cn(
                  "display text-[clamp(28px,3vw,38px)] font-medium leading-none",
                  isActive ? "text-[var(--accent-text)]" : "text-[var(--fg)]",
                )}
              >
                {opt.big}
              </div>
            ) : null}
            <div className="mt-1 text-[15px] font-medium text-[var(--fg)]">
              {opt.label}
            </div>
            {opt.hint ? (
              <div className="text-[12.5px] text-[var(--fg-dim)]">
                {opt.hint}
              </div>
            ) : null}
            {isActive ? (
              <span className="mono absolute right-4 top-4 text-[10px] uppercase tracking-[0.2em] text-[var(--accent-text)]">
                Picked
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

function ExtrasGrid<V extends string>({
  options,
  selected,
  onToggle,
}: {
  options: Option<V>[];
  selected: V[];
  onToggle: (v: V) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
      {options.map((opt) => {
        const isActive = selected.includes(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onToggle(opt.value)}
            className={cn(
              "group relative flex flex-col items-start gap-1 rounded-2xl border p-4 text-left transition-all",
              isActive
                ? "border-[var(--accent)] bg-[var(--accent)]/8 shadow-[0_0_20px_-12px_var(--accent-shadow)]"
                : "border-[var(--border-soft)] bg-[var(--ink-raised)] hover:border-[var(--border-warm)] hover:bg-[var(--ink-card)]",
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                "absolute right-3 top-3 inline-flex size-5 items-center justify-center rounded-full border transition-colors",
                isActive
                  ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--ink-deepest)]"
                  : "border-[var(--border-warm)] bg-transparent text-transparent",
              )}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path
                  d="M2 5l2 2 4-5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <div className="text-[15px] font-medium text-[var(--fg)]">
              {opt.label}
            </div>
            {opt.hint ? (
              <div className="text-[12.5px] text-[var(--fg-dim)]">
                {opt.hint}
              </div>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

// ── Result panel ─────────────────────────────────────────────────────────

function ResultPanel({
  rec,
  onRestart,
  onUpgradeToPrecise,
}: {
  rec: Recommendation;
  onRestart: () => void;
  onUpgradeToPrecise?: () => void;
}) {
  const verdictColor: Record<Recommendation["verdict"], string> = {
    "worth-it": "var(--status-live)",
    maybe: "var(--status-flag)",
    overkill: "var(--status-warn)",
  };
  const color = verdictColor[rec.verdict];

  return (
    <div className="space-y-10">
      {/* verdict + range */}
      <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:gap-12">
        <div>
          <div
            className="mono inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em]"
            style={{ borderColor: color, color }}
          >
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full"
              style={{ background: color }}
            />
            {rec.verdictLabel}
          </div>
          <p className="mt-6 max-w-[52ch] text-[17px] leading-[1.7] text-[var(--fg)]">
            {rec.verdictBlurb}
          </p>
          <p className="mono mt-3 text-[11px] uppercase tracking-[0.18em] text-[var(--fg-dim)]">
            Based on the {rec.mode === "quick" ? "5-question" : "10-question"}{" "}
            quiz · confidence: {rec.confidence}
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--ink-card)] p-6">
          <div className="mono text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--fg-faint)]">
            Sweet spot
          </div>
          <div
            className="mono mt-3 text-[clamp(28px,5vw,44px)] font-medium leading-[1.1]"
            style={{ color: "var(--accent-text)" }}
          >
            {rec.range.label}
          </div>
          <div className="mt-1 text-[13px] text-[var(--fg-muted)]">
            {rec.range.name} tier
          </div>
          <p className="mt-4 text-[13.5px] leading-relaxed text-[var(--fg-muted)]">
            {rec.range.blurb}
          </p>
          <div className="mt-4 border-t border-[var(--border-hairline)] pt-3 text-[12px] text-[var(--fg-dim)]">
            <strong className="font-medium text-[var(--fg-muted)]">
              Cable equivalent:
            </strong>{" "}
            {rec.range.cableEquivalent}
          </div>
        </div>
      </div>

      {/* warnings (always shown when present — these are the honesty mechanism) */}
      {rec.warnings.length > 0 && (
        <div className="space-y-3">
          {rec.warnings.map((w, i) => (
            <div
              key={i}
              className="flex gap-3 rounded-2xl border border-[var(--status-flag)]/30 bg-[var(--status-flag)]/5 p-4"
            >
              <span
                aria-hidden="true"
                className="mono mt-0.5 text-[16px] font-bold leading-none text-[var(--status-flag)]"
              >
                !
              </span>
              <p className="text-[14px] leading-relaxed text-[var(--fg-muted)]">
                {w}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* cheaper alternative — sibling, not footnote */}
      {rec.cheaperAlternative && (
        <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--ink-raised)] p-5">
          <div className="mono mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--accent-text)]">
            Save money instead
          </div>
          <div className="display text-[18px] font-medium text-[var(--fg)]">
            {rec.cheaperAlternative.label} also works
          </div>
          <p className="mt-1 text-[13.5px] text-[var(--fg-muted)]">
            {rec.cheaperAlternative.rationale}
          </p>
        </div>
      )}

      {/* reasons */}
      {rec.reasons.length > 0 && (
        <div>
          <div className="mono mb-4 text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--accent-text)]">
            Why
          </div>
          <ul className="space-y-3">
            {rec.reasons.map((r, i) => (
              <li
                key={i}
                className="flex gap-3 text-[15px] leading-[1.65] text-[var(--fg-muted)]"
              >
                <span
                  aria-hidden="true"
                  className="mt-2 inline-block size-1.5 shrink-0 rounded-full"
                  style={{ background: color }}
                />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* upgrade nudge if quick + low confidence */}
      {onUpgradeToPrecise && (
        <div className="rounded-2xl border border-dashed border-[var(--border-warm)] bg-[var(--ink-raised)]/40 p-5">
          <div className="display text-[16px] font-medium text-[var(--fg)]">
            Want a tighter answer?
          </div>
          <p className="mt-1 text-[13px] text-[var(--fg-muted)]">
            The 10-question precise quiz takes about three minutes and asks
            specifically about livestreaming, cameras, self-hosting, and
            weekly upload volume.
          </p>
          <button
            type="button"
            onClick={onUpgradeToPrecise}
            className="mono mt-3 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--accent-text)] hover:text-[var(--accent)]"
          >
            Take the precise quiz →
          </button>
        </div>
      )}

      {/* fiber lookup */}
      <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--ink-raised)] p-6 sm:p-8">
        <FiberLookup
          title="Find fiber providers at your address"
          subtitle="ZIP for a quick check, or full address for census-block precision. Each provider button goes to their own availability tool."
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border-hairline)] pt-6">
        <button
          type="button"
          onClick={onRestart}
          className="mono inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--fg-muted)] hover:text-[var(--accent-text)]"
        >
          <ArrowIcon className="rotate-180" />
          Start over
        </button>
        <a
          href="/fiber-vs-cable"
          className="mono text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--accent-text)] hover:text-[var(--accent)]"
        >
          Read the comparisons →
        </a>
      </div>
    </div>
  );
}

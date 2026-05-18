import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

/**
 * Loading skeleton for the quiz route. Renders while the server component
 * resolves searchParams + hydrates the QuizWizard. Keeps the layout
 * stable so the user doesn't see a blank page on slow networks.
 */
export default function QuizLoading() {
  return (
    <Section tone="default" className="pt-[calc(var(--nav-h)+72px)] pb-32">
      <Container size="wide">
        <div className="mono text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--accent-text)]">
          Loading the quiz
        </div>
        <div className="mt-5 grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <div>
            <div className="h-[60px] w-[80%] animate-pulse rounded-md bg-[var(--ink-raised)]" />
            <div className="mt-4 h-[60px] w-[60%] animate-pulse rounded-md bg-[var(--ink-raised)]" />
            <div className="mt-8 space-y-3">
              <div className="h-4 w-full animate-pulse rounded bg-[var(--ink-raised)]" />
              <div className="h-4 w-[85%] animate-pulse rounded bg-[var(--ink-raised)]" />
              <div className="h-4 w-[70%] animate-pulse rounded bg-[var(--ink-raised)]" />
            </div>
          </div>
          <div className="relative">
            <div className="h-[420px] w-full animate-pulse rounded-3xl border border-[var(--border-soft)] bg-[var(--ink-raised)]" />
          </div>
        </div>
      </Container>
    </Section>
  );
}

import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { DiagnosticWizard } from "@/components/diagnostic/diagnostic-wizard";
import {
  pageMetadata,
  JsonLd,
  buildArticleSchema,
  buildBreadcrumbSchema,
  buildHowToSchema,
} from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Why Is My Internet Slow? Honest 5-Question Diagnostic",
  description:
    "Five honest questions to figure out why your internet is slow — and whether fiber is the actual fix or your Wi-Fi router is just in a cabinet. We'll tell you which one you have.",
  path: "/why-is-my-internet-slow",
});

export default function WhyIsMyInternetSlow() {
  const path = "/why-is-my-internet-slow";
  return (
    <>
      <JsonLd
        data={buildArticleSchema({
          title: "Why Is My Internet Slow? — A 5-Question Diagnostic",
          description: metadata.description as string,
          path,
          articleSection: "Diagnostic",
          keywords: [
            "why is my internet slow",
            "internet slow at night",
            "wifi slow",
            "router slow",
            "bufferbloat",
            "data cap throttling",
            "upload speed slow",
            "fiber internet fix",
          ],
        })}
      />
      <JsonLd
        data={buildHowToSchema({
          name: "How to diagnose slow internet",
          description:
            "Five honest questions in sequence — the same path a network engineer would take — to find the real cause of slow internet and whether fiber would actually help.",
          totalTime: "PT1M",
          steps: [
            {
              name: "Describe what 'slow' looks like to you",
              text: "Pages timing out, video calls freezing, evenings only, after a big download — each pattern points to a different root cause.",
            },
            {
              name: "Identify when the slowness happens",
              text: "Time of day, end of the month, or after a specific event narrows the suspect list dramatically.",
            },
            {
              name: "Note your current ISP and plan tier",
              text: "Cable, DSL, satellite, 5G home, and fiber each have characteristic failure modes. Your plan tier matters too.",
            },
            {
              name: "Check the physical setup",
              text: "Router placement, age, and the cable between router and ONT/modem are the single biggest source of 'my fast plan feels slow.'",
            },
            {
              name: "Get the honest verdict",
              text: "The diagnostic returns one of eleven specific causes plus a clear answer on whether fiber would fix it or whether the problem is upstream of your ISP.",
            },
          ],
        })}
      />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Why is my internet slow?", path },
        ])}
      />

      <Section tone="default" className="pt-[calc(var(--nav-h)+72px)]">
        <Container>
          <Breadcrumb
            trail={[
              { name: "Home", path: "/" },
              { name: "Why is my internet slow?", path },
            ]}
          />
          <div className="mono text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--accent-text)]">
            Diagnose · 5 questions · ~60 seconds
          </div>
          <h1 className="display mt-4 max-w-[22ch] text-balance text-[clamp(40px,7vw,76px)] font-medium leading-[1.02] text-[var(--fg)]">
            Why is your internet{" "}
            <em className="font-light italic text-[var(--accent-text)]">
              actually
            </em>{" "}
            slow?
          </h1>
          <p className="mt-7 max-w-[62ch] text-[18px] leading-[1.65] text-[var(--fg-muted)]">
            Five questions. We&apos;ll tell you whether fiber would actually
            fix it, or whether the answer is &ldquo;your router has been in
            that cabinet since 2017.&rdquo; Most of the time, it&apos;s the
            second one — and we&apos;ll say so.
          </p>
        </Container>
      </Section>

      <Section tone="deep" className="border-t border-[var(--border-hairline)]">
        <Container size="narrow">
          <Reveal>
            <DiagnosticWizard />
          </Reveal>
        </Container>
      </Section>

      <Section tone="default" className="border-t border-[var(--border-hairline)]">
        <Container size="narrow">
          <Reveal>
            <div className="mono mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--accent-text)]">
              How honest this is
            </div>
            <h2 className="display max-w-[24ch] text-[clamp(24px,3.4vw,36px)] font-medium leading-[1.1] text-[var(--fg)]">
              Five of the eleven verdicts don&apos;t recommend fiber at all.
            </h2>
            <p className="mt-5 max-w-[62ch] text-[16px] leading-relaxed text-[var(--fg-muted)]">
              That ratio is the point. Tools that lie to you about your
              router get bookmarked once and never returned to. The verdicts
              that say &ldquo;move the router&rdquo; or &ldquo;replace your
              modem&rdquo; or &ldquo;your Wi-Fi is fighting your
              neighbors&rdquo; mean it — and we have those verdicts because
              that&apos;s genuinely the most common answer.
            </p>
            <p className="mt-4 max-w-[62ch] text-[16px] leading-relaxed text-[var(--fg-muted)]">
              When fiber would actually help — your upload is choked,
              you&apos;re past your data cap, your cable plant is degraded,
              your plan is too small for your household — we&apos;ll say
              that too. Each verdict has its own permanent URL so you can
              bookmark or share it.
            </p>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}

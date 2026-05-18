import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { VerdictCard } from "@/components/diagnostic/verdict-card";
import { verdicts, type VerdictId } from "@/lib/diagnostic";
import {
  pageMetadata,
  JsonLd,
  buildArticleSchema,
  buildBreadcrumbSchema,
} from "@/lib/metadata";

type Params = { slug: string };

export function generateStaticParams() {
  return Object.values(verdicts).map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const verdict = verdicts[slug as VerdictId];
  if (!verdict) return {};
  return pageMetadata({
    title: verdict.seoTitle,
    description: verdict.seoDescription,
    path: `/why-is-my-internet-slow/${verdict.slug}`,
  });
}

export default async function VerdictPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const verdict = verdicts[slug as VerdictId];
  if (!verdict) notFound();

  const path = `/why-is-my-internet-slow/${verdict.slug}`;
  return (
    <>
      <JsonLd
        data={buildArticleSchema({
          title: verdict.seoTitle,
          description: verdict.seoDescription,
          path,
        })}
      />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Why is my internet slow?", path: "/why-is-my-internet-slow" },
          { name: verdict.shortHeadline, path },
        ])}
      />

      <Section tone="default" className="pt-[calc(var(--nav-h)+72px)]">
        <Container size="narrow">
          <Breadcrumb
            trail={[
              { name: "Home", path: "/" },
              {
                name: "Why is my internet slow?",
                path: "/why-is-my-internet-slow",
              },
              { name: verdict.shortHeadline, path },
            ]}
          />
        </Container>
      </Section>

      <Section tone="deep" className="border-t border-[var(--border-hairline)]">
        <Container size="narrow">
          <Reveal>
            <VerdictCard verdict={verdict} showRunFullCta />
          </Reveal>
        </Container>
      </Section>
    </>
  );
}

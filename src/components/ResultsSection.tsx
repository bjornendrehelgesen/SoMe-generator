import { ResultCard } from "@/components/ResultCard";
import type { RewriteField, RewriteResult } from "@/types/rewrite";

type ResultsSectionProps = {
  results: RewriteResult | null;
  activeRefreshField: RewriteField | null;
  canUndo: (field: RewriteField) => boolean;
  onRegenerate: (field: RewriteField) => Promise<void>;
  onUndo: (field: RewriteField) => void;
};

export function ResultsSection({
  results,
  activeRefreshField,
  canUndo,
  onRegenerate,
  onUndo
}: ResultsSectionProps) {
  if (!results) {
    return null;
  }

  const primaryCards = [
    {
      title: "Facebook",
      content: results.facebook,
      copyLabel: "Kopier Facebook-forslaget",
      platform: "facebook" as const
    },
    {
      title: "Instagram",
      content: results.instagram,
      copyLabel: "Kopier Instagram-forslaget",
      platform: "instagram" as const
    },
    {
      title: "LinkedIn",
      content: results.linkedin,
      copyLabel: "Kopier LinkedIn-forslaget",
      platform: "linkedin" as const
    }
  ];

  const secondaryCards = [
    {
      title: "Kort tekst til bilde",
      content: results.imageText,
      copyLabel: "Kopier bildeteksten",
      platform: "imageText" as const
    },
    {
      title: "CTA",
      content: results.cta,
      copyLabel: "Kopier CTA",
      platform: "cta" as const
    }
  ];

  return (
    <section className="space-y-3" aria-live="polite">
      <div className="grid gap-3 lg:grid-cols-3">
        {primaryCards.map((card, index) => (
          <ResultCard
            key={card.title}
            title={card.title}
            content={card.content}
            copyLabel={card.copyLabel}
            accent={index}
            platform={card.platform}
            isRefreshing={activeRefreshField === card.platform}
            showUndo={canUndo(card.platform)}
            onRegenerate={onRegenerate}
            onUndo={onUndo}
          />
        ))}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {secondaryCards.map((card, index) => (
          <ResultCard
            key={card.title}
            title={card.title}
            content={card.content}
            copyLabel={card.copyLabel}
            accent={index + 3}
            platform={card.platform}
            variant="compact"
            isRefreshing={activeRefreshField === card.platform}
            showUndo={canUndo(card.platform)}
            onRegenerate={onRegenerate}
            onUndo={onUndo}
          />
        ))}
      </div>
    </section>
  );
}

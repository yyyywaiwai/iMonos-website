import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

export interface FaqItem {
  tag: string;
  question: string;
  /** Trusted authored markup. */
  answer: string;
}

/* The whole tree has to live in one component: Astro renders each child in a
   `.astro` file as its own root, so Radix's context would not reach the items. */
export function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <Accordion
      type="single"
      collapsible
      className="mt-10 divide-y divide-border overflow-hidden rounded-xl ring-1 ring-foreground/10"
    >
      {items.map(({ tag, question, answer }, i) => (
        <AccordionItem key={i} value={`item-${i}`} className="border-b-0 px-6">
          <AccordionTrigger className="gap-4 py-5 text-left hover:no-underline">
            <span className="flex min-w-0 flex-col items-start gap-2">
              <Badge variant="secondary" className="font-normal">
                {tag}
              </Badge>
              <span className="font-medium tracking-tight">{question}</span>
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div
              className="pb-2 text-sm leading-7 text-muted-foreground [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4 [&_li]:my-1 [&_p]:mt-3 [&_p:first-child]:mt-0 [&_strong]:font-medium [&_strong]:text-foreground [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-5"
              dangerouslySetInnerHTML={{ __html: answer }}
            />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

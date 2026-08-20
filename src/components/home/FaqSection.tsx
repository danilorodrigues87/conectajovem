import { useState } from 'react';
import { site } from '../../config/site';

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <div className="text-center">
        <p className="badge mb-3 inline-flex">FAQ</p>
        <h2 className="text-2xl font-bold md:text-3xl">Perguntas frequentes</h2>
      </div>
      <div className="mt-8 space-y-2">
        {site.faq.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={item.question} className="glass-card overflow-hidden p-0">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-medium"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                aria-expanded={isOpen}
              >
                {item.question}
                <span className="shrink-0 text-brand-accent">{isOpen ? '−' : '+'}</span>
              </button>
              {isOpen && (
                <div className="border-t border-edge px-5 pb-4 pt-2 text-sm text-muted">{item.answer}</div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

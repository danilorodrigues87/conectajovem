import { Layout } from './Layout';

export type LegalSection = {
  id: string;
  title: string;
  paragraphs: string[];
  list?: string[];
};

type Props = {
  badge: string;
  title: string;
  updatedAt: string;
  intro: string;
  sections: LegalSection[];
};

export function LegalDocumentLayout({ badge, title, updatedAt, intro, sections }: Props) {
  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-4 py-14">
        <p className="badge mb-3">{badge}</p>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="mt-2 text-sm text-faint">Última atualização: {updatedAt}</p>
        <p className="mt-6 text-lg text-muted">{intro}</p>

        <nav className="glass-card mt-8 text-sm" aria-label="Índice">
          <p className="mb-2 font-medium">Índice</p>
          <ol className="list-decimal space-y-1 pl-5 text-muted">
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="hover:text-brand-accent">
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="prose-legal mt-10 space-y-10">
          {sections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-24">
              <h2 className="text-xl font-semibold">{s.title}</h2>
              {s.paragraphs.map((p) => (
                <p key={p.slice(0, 40)} className="mt-3 text-muted leading-relaxed">
                  {p}
                </p>
              ))}
              {s.list && s.list.length > 0 && (
                <ul className="mt-3 list-disc space-y-2 pl-5 text-muted">
                  {s.list.map((item) => (
                    <li key={item.slice(0, 40)}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </div>
    </Layout>
  );
}

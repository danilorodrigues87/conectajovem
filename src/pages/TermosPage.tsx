import { LegalDocumentLayout } from '../components/LegalDocumentLayout';
import { termosMeta, termosSections } from '../content/legal/termos';

export function TermosPage() {
  return (
    <LegalDocumentLayout
      badge={termosMeta.badge}
      title={termosMeta.title}
      updatedAt={termosMeta.updatedAt}
      intro={termosMeta.intro}
      sections={termosSections}
    />
  );
}

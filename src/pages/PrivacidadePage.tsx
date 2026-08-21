import { LegalDocumentLayout } from '../components/LegalDocumentLayout';
import { privacidadeMeta, privacidadeSections } from '../content/legal/privacidade';

export function PrivacidadePage() {
  return (
    <LegalDocumentLayout
      badge={privacidadeMeta.badge}
      title={privacidadeMeta.title}
      updatedAt={privacidadeMeta.updatedAt}
      intro={privacidadeMeta.intro}
      sections={privacidadeSections}
    />
  );
}

import type { RedesSociais } from '../lib/social';
import { EMPTY_REDES, REDES_LABELS } from '../lib/social';

type Props = {
  value: RedesSociais;
  onChange: (next: RedesSociais) => void;
};

export function SocialLinksForm({ value, onChange }: Props) {
  return (
    <div className="space-y-3 rounded-xl border border-[var(--cj-border)] bg-white/[0.02] p-4">
      <div>
        <h3 className="text-sm font-semibold">Redes sociais (opcional)</h3>
        <p className="mt-1 text-xs text-subtle">
          Links públicos para empresas e candidatos conhecerem seu perfil. Use URLs completas (https://…).
        </p>
      </div>
      {(Object.keys(REDES_LABELS) as (keyof RedesSociais)[]).map((key) => (
        <input
          key={key}
          className="input"
          placeholder={REDES_LABELS[key]}
          value={value[key]}
          onChange={(e) => onChange({ ...value, [key]: e.target.value })}
          maxLength={500}
        />
      ))}
    </div>
  );
}

export { EMPTY_REDES };

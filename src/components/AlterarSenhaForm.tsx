import { FormEvent, useState } from 'react';

type SenhaPayload = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type Props = {
  onSubmit: (payload: SenhaPayload) => Promise<{ message?: string }>;
  minLength?: number;
};

export function AlterarSenhaForm({ onSubmit, minLength = 6 }: Props) {
  const [atual, setAtual] = useState('');
  const [nova, setNova] = useState('');
  const [confirma, setConfirma] = useState('');
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState('');
  const [ok, setOk] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro('');
    setOk('');
    if (nova.length < minLength) {
      setErro(`A nova senha deve ter pelo menos ${minLength} caracteres.`);
      return;
    }
    if (nova !== confirma) {
      setErro('A confirmação da nova senha não confere.');
      return;
    }
    setSaving(true);
    try {
      const res = await onSubmit({
        currentPassword: atual,
        newPassword: nova,
        confirmPassword: confirma,
      });
      setOk(res.message || 'Senha alterada com sucesso.');
      setAtual('');
      setNova('');
      setConfirma('');
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Falha ao alterar senha.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card mt-8 space-y-4 p-6">
      <div>
        <h2 className="text-lg font-semibold">Alterar senha</h2>
        <p className="mt-1 text-sm text-muted">
          Use uma senha forte. Se você também acessa o portal EAD da escola com o mesmo e-mail, a senha é compartilhada.
        </p>
      </div>
      {erro && <p className="text-sm text-red-500">{erro}</p>}
      {ok && <p className="text-sm text-emerald-600">{ok}</p>}
      <div>
        <label className="text-sm font-medium">Senha atual</label>
        <input
          type="password"
          className="input mt-1"
          autoComplete="current-password"
          value={atual}
          onChange={(e) => setAtual(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium">Nova senha</label>
        <input
          type="password"
          className="input mt-1"
          autoComplete="new-password"
          minLength={minLength}
          value={nova}
          onChange={(e) => setNova(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium">Confirmar nova senha</label>
        <input
          type="password"
          className="input mt-1"
          autoComplete="new-password"
          minLength={minLength}
          value={confirma}
          onChange={(e) => setConfirma(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="btn-primary" disabled={saving}>
        {saving ? 'Salvando…' : 'Alterar senha'}
      </button>
    </form>
  );
}

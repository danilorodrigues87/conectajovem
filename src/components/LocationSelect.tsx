import { useEffect, useState } from 'react';
import { api, type Cidade, type Estado } from '../lib/api';

type Props = {
  estadoId: string;
  cidadeId: string;
  uf: string;
  onChange: (next: { estadoId: string; cidadeId: string; uf: string }) => void;
  cidadeRequired?: boolean;
  className?: string;
};

export function LocationSelect({
  estadoId,
  cidadeId,
  uf,
  onChange,
  cidadeRequired,
  className = '',
}: Props) {
  const [estados, setEstados] = useState<Estado[]>([]);
  const [cidades, setCidades] = useState<Cidade[]>([]);
  const [loadingCidades, setLoadingCidades] = useState(false);

  useEffect(() => {
    api.estados().then((r) => setEstados(r.items || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (estadoId || !uf || !estados.length) return;
    const match = estados.find((e) => e.uf === uf.toUpperCase());
    if (match) {
      onChange({ estadoId: String(match.id), cidadeId, uf: match.uf });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estados, uf, estadoId]);

  useEffect(() => {
    if (!estadoId) {
      setCidades([]);
      return;
    }
    setLoadingCidades(true);
    api
      .cidadesPorEstado(Number(estadoId))
      .then((r) => setCidades(r.items || []))
      .catch(() => setCidades([]))
      .finally(() => setLoadingCidades(false));
  }, [estadoId]);

  function onEstadoChange(nextId: string) {
    const est = estados.find((e) => String(e.id) === nextId);
    onChange({
      estadoId: nextId,
      cidadeId: '',
      uf: est?.uf || '',
    });
  }

  return (
    <div className={`grid gap-4 md:grid-cols-2 ${className}`}>
      <div>
        <label className="mb-1.5 block text-xs text-faint">Estado</label>
        <select className="select w-full" value={estadoId} onChange={(e) => onEstadoChange(e.target.value)}>
          <option value="">Selecione o estado</option>
          {estados.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nome} ({e.uf})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1.5 block text-xs text-faint">Cidade</label>
        <select
          className="select w-full"
          value={cidadeId}
          disabled={!estadoId || loadingCidades}
          required={cidadeRequired}
          onChange={(e) => onChange({ estadoId, cidadeId: e.target.value, uf })}
        >
          <option value="">{loadingCidades ? 'Carregando…' : 'Selecione a cidade'}</option>
          {cidades.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

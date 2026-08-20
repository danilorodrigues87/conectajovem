import { LocationSelect } from './LocationSelect';

type Props = {
  logradouro: string;
  numero: string;
  bairro: string;
  estadoId: string;
  cidadeId: string;
  uf: string;
  onLogradouro: (v: string) => void;
  onNumero: (v: string) => void;
  onBairro: (v: string) => void;
  onLocation: (next: { estadoId: string; cidadeId: string; uf: string }) => void;
};

export function AddressFields({
  logradouro,
  numero,
  bairro,
  estadoId,
  cidadeId,
  uf,
  onLogradouro,
  onNumero,
  onBairro,
  onLocation,
}: Props) {
  return (
    <div className="space-y-4">
      <p className="text-sm font-medium">Endereço</p>
      <div className="grid gap-4 md:grid-cols-[1fr_120px]">
        <input
          className="input"
          placeholder="Rua / Avenida"
          value={logradouro}
          onChange={(e) => onLogradouro(e.target.value)}
        />
        <input
          className="input"
          placeholder="Nº"
          value={numero}
          onChange={(e) => onNumero(e.target.value)}
        />
      </div>
      <input
        className="input"
        placeholder="Bairro"
        value={bairro}
        onChange={(e) => onBairro(e.target.value)}
      />
      <LocationSelect estadoId={estadoId} cidadeId={cidadeId} uf={uf} onChange={onLocation} />
    </div>
  );
}

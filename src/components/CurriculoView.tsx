import type { CandidatoPerfil } from '../lib/api';
import { CurriculoDocument } from './CurriculoDocument';

export function CurriculoView({ perfil }: { perfil: CandidatoPerfil }) {
  return (
    <div className="mt-2 overflow-x-auto">
      <CurriculoDocument perfil={perfil} />
    </div>
  );
}

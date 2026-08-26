import { AdCarousel, slotAdVariant } from './AdCarousel';
import { useAnuncios, type AnuncioGeo } from '../../hooks/useAnuncios';
import type { AnuncioSlot } from '../../lib/api';

type Props = {
  slot: AnuncioSlot;
  geo?: AnuncioGeo;
  className?: string;
};

export function AdSlot({ slot, geo, className }: Props) {
  const { items, loading, onClique } = useAnuncios(slot, geo);

  if (loading || !items.length) return null;

  return (
    <AdCarousel items={items} onClique={onClique} className={className} variant={slotAdVariant(slot)} />
  );
}

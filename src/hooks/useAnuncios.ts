import { useCallback, useEffect, useRef, useState } from 'react';
import { api, type AnuncioPublico, type AnuncioSlot } from '../lib/api';

export type AnuncioGeo = {
  uf?: string;
  cidadeId?: number;
};

export function useAnuncios(slot: AnuncioSlot, geo?: AnuncioGeo) {
  const [items, setItems] = useState<AnuncioPublico[]>([]);
  const [loading, setLoading] = useState(true);
  const impressaoEnviada = useRef(false);
  const geoKey = `${geo?.uf || ''}-${geo?.cidadeId || ''}`;

  useEffect(() => {
    let cancel = false;
    setLoading(true);
    api
      .anunciosPublicos({
        slot,
        uf: geo?.uf,
        cidadeId: geo?.cidadeId,
      })
      .then((r) => {
        if (!cancel) setItems(r.items || []);
      })
      .catch(() => {
        if (!cancel) setItems([]);
      })
      .finally(() => {
        if (!cancel) setLoading(false);
      });
    return () => {
      cancel = true;
      impressaoEnviada.current = false;
    };
  }, [slot, geoKey, geo?.uf, geo?.cidadeId]);

  const registrarImpressoes = useCallback(
    (lista: AnuncioPublico[]) => {
      if (impressaoEnviada.current || !lista.length) return;
      impressaoEnviada.current = true;
      lista.forEach((a) => {
        api.registrarEventoAnuncio(a.id, 'impressao', slot, geo).catch(() => {});
      });
    },
    [slot, geo],
  );

  useEffect(() => {
    if (!loading && items.length) {
      registrarImpressoes(items);
    }
  }, [loading, items, registrarImpressoes]);

  const onClique = useCallback(
    (anuncio: AnuncioPublico) => {
      api.registrarEventoAnuncio(anuncio.id, 'clique', slot, geo).catch(() => {});
      if (anuncio.linkDestino) {
        window.open(anuncio.linkDestino, '_blank', 'noopener,noreferrer');
      }
    },
    [slot, geo],
  );

  return { items, loading, onClique };
}

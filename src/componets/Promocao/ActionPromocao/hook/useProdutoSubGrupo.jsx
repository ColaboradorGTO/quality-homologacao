import { useQuery } from "react-query"
import { buscarProdutosSubGrupo } from "../services/promocaoService"

export const useProdutoSubGrupo = (subGrupos) => {
  const { data: dadosProdutoSubGrupo = [] } = useQuery(
    ['produto-subGrupo', subGrupos],
    () => buscarProdutosSubGrupo(subGrupos),
    { enabled: Boolean(subGrupos.length), staleTime: 1000 * 60 * 60, cacheTime: 1000 * 60 * 60, }
  );

  return dadosProdutoSubGrupo;
}

import { useQuery } from 'react-query';
import { get } from '../api/funcRequest';



export const useFetchData = (key, url, enabled) => {
  return useQuery(
    key,
    async () => {
      const response = await get(url);
      return response.data;
    },
    {  staleTime: 5 * 60 * 1000, enabled: enabled }
  );
};

export const useFetchEmpresas = (marcaSelecionada, options = {}) => {
  return useQuery(
    ['listaEmpresaComercial', marcaSelecionada],
    async () => {
      if (marcaSelecionada) {
        const response = await get(`/listaEmpresaComercial?idMarca=${marcaSelecionada}`);
        return response.data;
      }
      return [];
    },
    {
      enabled: !!marcaSelecionada, 
      staleTime: 5 * 60 * 1000,
      ...options,
    }
  );
};
export const useFetchEmpresasContabilidade = (marcaSelecionada, options = {}) => {
  return useQuery(
    ['empresas', marcaSelecionada],
    async () => {
      if (marcaSelecionada) {
        const response = await get(`/empresas?idGrupoEmpresa=${marcaSelecionada}`);
        return response.data;
      }
      return [];
    },
    {
      enabled: !!marcaSelecionada, 
      staleTime: 5 * 60 * 1000,
      ...options,
    }
  );
};

